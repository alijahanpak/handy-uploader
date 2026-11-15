// Lets TypeScript accept <handy-uploader> in JSX. React 18 sets everything on a custom
// element as an attribute and ignores on* handlers there, so only attributes and `ref` are
// declared: the `files` property and hu-* events go through the ref (see App.tsx).
import type { RefAttributes } from 'react'
import type { HandyUploaderElement } from 'handy-uploader/element'

type HandyUploaderJSX = RefAttributes<HandyUploaderElement> & {
  id?: string
  class?: string
  'file-uploader-type'?: 'thumbnail' | 'simple' | 'table'
  'max-file-count'?: number | string
  'max-file-size'?: number | string
  'file-accept'?: string
  // React 18 writes these as change-file-name="true" / "false"; the element reads both right.
  'change-file-name'?: boolean
  'add-file-description'?: boolean
  'add-file-tag'?: boolean
  tags?: string
  lang?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'handy-uploader': HandyUploaderJSX
    }
  }
}
