// Public types of <handy-uploader>. Deliberately free of Vue types, so TypeScript works in
// React, Svelte, Angular, … projects that don't have Vue installed.
import type { CardType, DocumentAttachment, LanguageCollection } from '../types'
import type { AttachmentError } from '../core'

/** Properties of the <handy-uploader> element. Each one can also be set as a kebab-case attribute. */
export interface HandyUploaderElementProps {
  /** The file list. Set and read it as a JS property: `el.files = [...]`. */
  files: DocumentAttachment[]
  /** Layout. Attribute: `file-uploader-type`. Default `'thumbnail'`. */
  fileUploaderType?: 'thumbnail' | 'simple' | 'table'
  /** Maximum size per file, in bytes. Attribute: `max-file-size`. Default 5242880 (5 MB). */
  maxFileSize?: number
  /** Maximum number of files. Attribute: `max-file-count`. Default 10. */
  maxFileCount?: number
  /** Accepted types, HTML accept format (".pdf,image/*"). Attribute: `file-accept`. */
  fileAccept?: string
  /** Compress JPEG/PNG/WebP images. Attribute: `image-compressor`. */
  imageCompressor?: boolean
  /** JPEG quality 0–1. Attribute: `image-compress-level`. Default 0.8. */
  imageCompressLevel?: number
  /** Show image previews and video thumbnails. Attribute: `thumb`. Default true. */
  thumb?: boolean
  /** Thumbnail view: card width out of 12 columns. Attribute: `cols`. Default 3. */
  cols?: number
  /** Card style. Attribute: `card-type`. */
  cardType?: CardType
  /** Show the file count on the Insert button. Attribute: `badge-counter`. Default true. */
  badgeCounter?: boolean
  /** Button colour: a Vuetify colour name or any CSS colour. Attribute: `btn-color`. */
  btnColor?: string
  /** Let users rename files. Attribute: `change-file-name`. */
  changeFileName?: boolean
  /** Let users add a description. Attribute: `add-file-description`. */
  addFileDescription?: boolean
  /** Let users pick tags from `tags`. Attribute: `add-file-tag`. */
  addFileTag?: boolean
  /** Tags to choose from. Attribute: `tags="invoice, contract"` (comma-separated). */
  tags?: string[]
  /** Show the Insert button. Attribute: `insert-permission`. Default true. */
  insertPermission?: boolean
  /** Show the edit button. Attribute: `edit-permission`. Default true. */
  editPermission?: boolean
  /** Show the delete button. Attribute: `delete-permission`. Default true. */
  deletePermission?: boolean
  /** Table view: show the preview column. Attribute: `table-thumb-column`. Default true. */
  tableThumbColumn?: boolean
  /** Table view: sticky header. Attribute: `table-fixed-header`. Default true. */
  tableFixedHeader?: boolean
  /** Table view: height in pixels. Attribute: `table-height`. Default 400. */
  tableHeight?: number
  /** Language: en, fa, fr, ch, ar, or a key from `customLang`. Attribute: `lang`. */
  lang?: string
  /** Your own translations (JS property only). */
  customLang?: LanguageCollection | null
  /** Right-to-left layout (automatic for fa and ar). Attribute: `rtl-support`. */
  rtlSupport?: boolean
}

/** The <handy-uploader> element. */
export type HandyUploaderElement = HTMLElement & HandyUploaderElementProps

export interface HandyUploaderElementConstructor {
  new (): HandyUploaderElement
  prototype: HandyUploaderElement
}

/** `hu-change`: the file list changed (added, edited or removed). */
export interface HandyUploaderChangeDetail {
  files: DocumentAttachment[]
}
/** `hu-add`: files were added. */
export interface HandyUploaderAddDetail {
  added: DocumentAttachment[]
}
/** `hu-remove`: a file was removed. */
export interface HandyUploaderRemoveDetail {
  attachment: DocumentAttachment
  index: number
}
/** `hu-error`: files were rejected. */
export interface HandyUploaderErrorDetail {
  errors: AttachmentError[]
}

/**
 * Events dispatched by <handy-uploader>. They are prefixed with `hu-` so they can't be confused
 * with native `change`/`error` events bubbling up from the inputs inside the element.
 */
export interface HandyUploaderEventMap {
  'hu-change': CustomEvent<HandyUploaderChangeDetail>
  'hu-add': CustomEvent<HandyUploaderAddDetail>
  'hu-remove': CustomEvent<HandyUploaderRemoveDetail>
  'hu-error': CustomEvent<HandyUploaderErrorDetail>
}
