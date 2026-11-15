import { defineComponent, h, ref, useHost, type PropType } from 'vue'
import type { DocumentAttachment, LanguageCollection } from '../types'
import type { AttachmentError } from '../core'
import type {
  HandyUploaderAddDetail,
  HandyUploaderChangeDetail,
  HandyUploaderErrorDetail,
  HandyUploaderRemoveDetail
} from './types'
import HandyUploader from '../vue/components/HandyUploader.vue'

/**
 * The props of the framework-free HandyUploader, as they arrive from HTML attributes or JS
 * properties. Attributes are always strings, so every value is normalised before use, and
 * props that were not set are left out so HandyUploader's own defaults apply.
 */
type Kind = 'string' | 'number' | 'boolean' | 'list' | 'object'

const PROPS: Record<string, Kind> = {
  lang: 'string',
  fileUploaderType: 'string',
  cardType: 'string',
  btnColor: 'string',
  fileAccept: 'string',
  maxFileSize: 'number',
  maxFileCount: 'number',
  imageCompressLevel: 'number',
  tableHeight: 'number',
  cols: 'number',
  badgeCounter: 'boolean',
  imageCompressor: 'boolean',
  thumb: 'boolean',
  tableThumbColumn: 'boolean',
  tableFixedHeader: 'boolean',
  rtlSupport: 'boolean',
  changeFileName: 'boolean',
  addFileDescription: 'boolean',
  addFileTag: 'boolean',
  insertPermission: 'boolean',
  editPermission: 'boolean',
  deletePermission: 'boolean',
  tags: 'list',
  customLang: 'object'
}

const RUNTIME_TYPES: Record<Kind, PropType<unknown>> = {
  string: String,
  number: [Number, String],
  // String too, so that attribute="false" can be read as false (Vue would treat it as truthy).
  boolean: [Boolean, String],
  list: [Array, String],
  object: [Object, String]
}

const isBlank = (value: unknown) => typeof value === 'string' && value.trim() === ''

function normalise(name: string, kind: Kind, value: unknown): unknown {
  if (value === undefined || value === null) return undefined
  switch (kind) {
    case 'number': {
      // An empty attribute (max-file-count="") means "not set", not 0.
      if (isBlank(value)) return undefined
      const n = typeof value === 'number' ? value : Number(value)
      return Number.isFinite(n) ? n : undefined
    }
    case 'boolean':
      if (typeof value === 'string') {
        return !['false', '0', 'no', 'off'].includes(value.trim().toLowerCase())
      }
      return Boolean(value)
    case 'list':
      // Attribute form: tags="invoice, contract, photo"
      if (typeof value === 'string') {
        return value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      }
      return Array.isArray(value) ? value : undefined
    case 'object':
      // Attribute form: custom-lang='{"de": {...}}'
      if (typeof value === 'string') {
        if (isBlank(value)) return undefined
        try {
          return JSON.parse(value)
        } catch {
          console.warn(`[handy-uploader] ${name}: attribute is not valid JSON, ignoring it.`)
          return undefined
        }
      }
      return value
    default:
      return value
  }
}

type InnerApi = {
  add: (files: FileList | File[]) => Promise<DocumentAttachment[]>
  remove: (index: number) => void
  openInsert: () => void
}

export default defineComponent({
  name: 'HandyUploaderElement',
  props: {
    /** The file list. Set it as a JS property (`el.files = [...]`); read it back the same way. */
    files: { type: Array as PropType<DocumentAttachment[]>, default: undefined },
    ...Object.fromEntries(
      Object.entries(PROPS).map(([name, kind]) => [
        name,
        { type: RUNTIME_TYPES[kind], default: undefined }
      ])
    )
  },
  setup(props, { expose }) {
    const host = useHost()
    const inner = ref<InnerApi | null>(null)

    // DOM events with a clear `detail`, bubbling so they can be listened to on a parent.
    // Prefixed with `hu-` because native `change` events from the inputs inside bubble too.
    function dispatch<T>(type: string, detail: T) {
      host?.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }))
    }

    // The new list is written to the element's own `files` property (the single source of
    // truth), so `el.files` always returns the current list.
    function setFiles(next: DocumentAttachment[]) {
      if (host) (host as unknown as { files: DocumentAttachment[] }).files = next
    }

    // Methods on the element, for apps with their own drop zone or paste handling.
    expose({
      /** Validate, read and add files. Resolves with the attachments that were added. */
      addFiles: (files: FileList | File[]) => inner.value?.add(files) ?? Promise.resolve([]),
      /** Remove a file by index, without the confirmation dialog. */
      removeAt: (index: number) => inner.value?.remove(index),
      /** Open the insert dialog. */
      openInsert: () => inner.value?.openInsert()
    })

    return () => {
      const passed: Record<string, unknown> = {}
      for (const [name, kind] of Object.entries(PROPS)) {
        const value = normalise(name, kind, (props as Record<string, unknown>)[name])
        if (value !== undefined) passed[name] = value
      }
      return h(HandyUploader, {
        ...passed,
        ref: inner,
        customLang: (passed.customLang as LanguageCollection | undefined) ?? null,
        // A copy: HandyUploader updates the array it is given in place, and the caller's array
        // (e.g. React state) and arrays from earlier events must never change behind their back.
        documentAttachment: [...(props.files ?? [])],
        'onUpdate:documentAttachment': (value: DocumentAttachment[]) => {
          const next = [...value]
          setFiles(next)
          dispatch<HandyUploaderChangeDetail>('hu-change', { files: next })
        },
        onAdd: (added: DocumentAttachment[]) =>
          dispatch<HandyUploaderAddDetail>('hu-add', { added }),
        onRemove: (attachment: DocumentAttachment, index: number) =>
          dispatch<HandyUploaderRemoveDetail>('hu-remove', { attachment, index }),
        onError: (errors: AttachmentError[]) =>
          dispatch<HandyUploaderErrorDetail>('hu-error', { errors })
      })
    }
  }
})
