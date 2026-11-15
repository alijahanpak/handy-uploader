import { defineComponent, h, shallowRef, useHost, watch, type PropType } from 'vue'
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
  object: Object
}

function normalise(kind: Kind, value: unknown): unknown {
  if (value === undefined || value === null) return undefined
  switch (kind) {
    case 'number': {
      const n = typeof value === 'number' ? value : Number(value)
      return Number.isFinite(n) ? n : undefined
    }
    case 'boolean':
      if (typeof value === 'string') return !['false', '0', 'no', 'off'].includes(value.trim().toLowerCase())
      return Boolean(value)
    case 'list':
      // Attribute form: tags="invoice, contract, photo"
      if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean)
      return Array.isArray(value) ? value : undefined
    default:
      return value
  }
}

export default defineComponent({
  name: 'HandyUploaderElement',
  props: {
    /** The file list. Set it as a JS property (`el.files = [...]`); read it back the same way. */
    files: { type: Array as PropType<DocumentAttachment[]>, default: undefined },
    ...Object.fromEntries(
      Object.entries(PROPS).map(([name, kind]) => [name, { type: RUNTIME_TYPES[kind], default: undefined }])
    )
  },
  setup(props) {
    const host = useHost()
    const files = shallowRef<DocumentAttachment[]>(props.files ?? [])

    watch(
      () => props.files,
      (value) => {
        files.value = value ?? []
      }
    )

    // DOM events with a clear `detail`, bubbling so they can be listened to on a parent.
    // Prefixed with `hu-` because native `change` events from the inputs inside bubble too.
    function dispatch<T>(type: string, detail: T) {
      host?.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }))
    }

    // Write back through the element's own `files` property, so `el.files` always returns the
    // current list (the watcher above then sees the same array and changes nothing).
    function setFiles(next: DocumentAttachment[]) {
      files.value = next
      if (host) (host as unknown as { files: DocumentAttachment[] }).files = next
    }

    return () => {
      const passed: Record<string, unknown> = {}
      for (const [name, kind] of Object.entries(PROPS)) {
        const value = normalise(kind, (props as Record<string, unknown>)[name])
        if (value !== undefined) passed[name] = value
      }
      return h(HandyUploader, {
        ...passed,
        customLang: (passed.customLang as LanguageCollection | undefined) ?? null,
        documentAttachment: files.value,
        'onUpdate:documentAttachment': (value: DocumentAttachment[]) => {
          const next = [...value]
          setFiles(next)
          dispatch<HandyUploaderChangeDetail>('hu-change', { files: next })
        },
        onAdd: (added: DocumentAttachment[]) => dispatch<HandyUploaderAddDetail>('hu-add', { added }),
        onRemove: (attachment: DocumentAttachment, index: number) =>
          dispatch<HandyUploaderRemoveDetail>('hu-remove', { attachment, index }),
        onError: (errors: AttachmentError[]) => dispatch<HandyUploaderErrorDetail>('hu-error', { errors })
      })
    }
  }
})
