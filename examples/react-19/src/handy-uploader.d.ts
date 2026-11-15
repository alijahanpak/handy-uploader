// Lets TypeScript accept <handy-uploader> in JSX (React 19 types: the JSX namespace lives
// in the 'react' module).
import type { DOMAttributes, RefAttributes } from 'react'
import type {
  DocumentAttachment,
  HandyUploaderAddDetail,
  HandyUploaderChangeDetail,
  HandyUploaderElement,
  HandyUploaderErrorDetail,
  HandyUploaderRemoveDetail
} from 'handy-uploader/element'

type HandyUploaderJSX = DOMAttributes<HandyUploaderElement> &
  RefAttributes<HandyUploaderElement> & {
    id?: string
    class?: string
    // JS properties (React 19 sets these as properties because they exist on the element)
    files?: DocumentAttachment[]
    // Attributes
    'file-uploader-type'?: 'thumbnail' | 'simple' | 'table'
    'max-file-count'?: number | string
    'max-file-size'?: number | string
    'file-accept'?: string
    'change-file-name'?: boolean
    'add-file-description'?: boolean
    'add-file-tag'?: boolean
    tags?: string
    lang?: string
    // Custom events: React 19 adds a listener for on<event-name>, case-sensitive.
    'onhu-change'?: (event: CustomEvent<HandyUploaderChangeDetail>) => void
    'onhu-add'?: (event: CustomEvent<HandyUploaderAddDetail>) => void
    'onhu-remove'?: (event: CustomEvent<HandyUploaderRemoveDetail>) => void
    'onhu-error'?: (event: CustomEvent<HandyUploaderErrorDetail>) => void
  }

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'handy-uploader': HandyUploaderJSX
    }
  }
}
