import { computed, ref, unref, type Ref } from 'vue'
import type { DocumentAttachment, FileData } from '../types'
import {
  filterByAccept,
  precheckFiles,
  prepareAttachments,
  readFiles,
  type AttachmentError
} from '../core'

export interface UploaderOptions {
  /** Maximum size per file, in bytes. Default 5 MB. */
  maxFileSize?: number
  /** Maximum number of files in the list. Default 10. */
  maxFileCount?: number
  /** Same format as the HTML accept attribute, e.g. ".pdf,image/*". Default: everything. */
  accept?: string
  /** Re-encode JPEG/PNG/WebP images as JPEG when that makes them smaller. */
  imageCompressor?: boolean
  /** JPEG quality between 0 and 1. Default 0.8. */
  imageCompressLevel?: number
}

export const DEFAULT_UPLOADER_OPTIONS: Required<UploaderOptions> = {
  maxFileSize: 5 * 1024 * 1024,
  maxFileCount: 10,
  accept: '',
  imageCompressor: false,
  imageCompressLevel: 0.8
}

type MaybeRefOrGetter<T> = T | Ref<T> | (() => T)

export type EditableFields = Partial<Pick<FileData, 'name' | 'description' | 'tags'>>

/**
 * Vue adapter over the framework-agnostic core. Owns no UI: pass it the attachment list
 * (e.g. a v-model ref) and build any markup on top. The list is always replaced, never
 * mutated, so it works with props/emit, Pinia and plain refs alike.
 */
export function useUploader(
  attachments: Ref<DocumentAttachment[]>,
  options: MaybeRefOrGetter<UploaderOptions> = {}
) {
  const resolveOptions = (): Required<UploaderOptions> => ({
    ...DEFAULT_UPLOADER_OPTIONS,
    ...(typeof options === 'function' ? options() : unref(options))
  })

  const isProcessing = ref(false)
  const errors = ref<AttachmentError[]>([])
  const count = computed(() => attachments.value.length)
  const canAddMore = computed(() => count.value < resolveOptions().maxFileCount)

  // Operations run one after another so each one sees the count left by the previous one.
  let queue: Promise<unknown> = Promise.resolve()
  function enqueue<T>(task: () => Promise<T>): Promise<T> {
    const next = queue.then(async () => {
      isProcessing.value = true
      try {
        return await task()
      } finally {
        isProcessing.value = false
      }
    })
    queue = next.catch(() => undefined)
    return next
  }

  type Pending = number | (() => number)
  const pendingCount = (pending: Pending) => (typeof pending === 'function' ? pending() : pending)

  async function doStage(files: File[], pending: Pending) {
    const opts = resolveOptions()
    const byType = filterByAccept(files, opts.accept)
    // Reject by size/count before reading, so large or surplus files never hit memory.
    const byLimits = precheckFiles(byType.accepted, {
      currentCount: attachments.value.length + pendingCount(pending),
      maxFileCount: opts.maxFileCount,
      maxFileSize: opts.maxFileSize
    })
    const staged = await readFiles(byLimits.accepted)
    return { staged, errors: [...byType.errors, ...byLimits.errors] }
  }

  async function doCommit(staged: DocumentAttachment[]) {
    const opts = resolveOptions()
    const result = await prepareAttachments(staged, {
      currentCount: attachments.value.length,
      maxFileCount: opts.maxFileCount,
      maxFileSize: opts.maxFileSize,
      imageCompressor: opts.imageCompressor,
      imageCompressLevel: opts.imageCompressLevel
    })
    if (result.accepted.length > 0) {
      attachments.value = [...attachments.value, ...result.accepted]
    }
    return result
  }

  /**
   * Step 1 of 2: checks type, size and count, then reads the files that pass. Nothing is
   * added to the list yet, so names, descriptions and tags can be edited on the staged
   * attachments before commit(). `pending` is the number of files already staged; pass a
   * function to have it read when this step actually runs (after earlier queued steps).
   */
  function stage(files: FileList | File[], pending: Pending = 0): Promise<DocumentAttachment[]> {
    const list = Array.from(files)
    return enqueue(async () => {
      const result = await doStage(list, pending)
      errors.value = result.errors
      return result.staged
    })
  }

  /** Step 2 of 2: validates staged attachments (compressing images if enabled) and appends them. */
  function commit(staged: DocumentAttachment[]): Promise<DocumentAttachment[]> {
    return enqueue(async () => {
      const result = await doCommit(staged)
      errors.value = result.errors
      return result.accepted
    })
  }

  /** stage() + commit() as one queued step. Resolves with the attachments that were added. */
  function add(files: FileList | File[]): Promise<DocumentAttachment[]> {
    const list = Array.from(files)
    return enqueue(async () => {
      const staged = await doStage(list, 0)
      const committed = await doCommit(staged.staged)
      errors.value = [...staged.errors, ...committed.errors]
      return committed.accepted
    })
  }

  function remove(index: number) {
    attachments.value = attachments.value.filter((_, i) => i !== index)
  }

  function update(index: number, changes: EditableFields) {
    attachments.value = attachments.value.map((item, i) =>
      i === index ? { file: { ...item.file, ...changes } } : item
    )
  }

  function clear() {
    attachments.value = []
  }

  function dismissErrors() {
    errors.value = []
  }

  return {
    isProcessing,
    errors,
    count,
    canAddMore,
    options: computed(resolveOptions),
    add,
    stage,
    commit,
    remove,
    update,
    clear,
    dismissErrors
  }
}
