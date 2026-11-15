import { computed, ref, unref, type Ref } from 'vue'
import type { DocumentAttachment, FileData } from '../types'
import {
  filterByAccept,
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

  // Adds run one after another so each one sees the count left by the previous one.
  let queue: Promise<unknown> = Promise.resolve()

  async function run(files: File[]): Promise<DocumentAttachment[]> {
    const opts = resolveOptions()
    isProcessing.value = true
    try {
      const byType = filterByAccept(files, opts.accept)
      const staged = await readFiles(byType.accepted)
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
      errors.value = [...byType.errors, ...result.errors]
      return result.accepted
    } finally {
      isProcessing.value = false
    }
  }

  /** Validates, reads and appends files. Resolves with the attachments that were added. */
  function add(files: FileList | File[]): Promise<DocumentAttachment[]> {
    const list = Array.from(files)
    const next = queue.then(() => run(list))
    queue = next.catch(() => undefined)
    return next
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
    remove,
    update,
    clear,
    dismissErrors
  }
}
