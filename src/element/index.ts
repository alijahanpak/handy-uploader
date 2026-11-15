// 'handy-uploader/element': the <handy-uploader> Web Component.
//
// Works in any framework (React, Svelte, Angular, …) or plain HTML. The bundle is
// self-contained (Vue is included), so nothing else needs to be installed, and the default
// theme is injected automatically. It renders without Shadow DOM, so the --hu-* CSS
// variables and your own CSS apply exactly as with the Vue component.
import { defineCustomElement } from 'vue'
import themeCss from '../vue/theme.css?inline'
import HandyUploaderElementComponent from './HandyUploaderElement'

import type {
  HandyUploaderElement as HandyUploaderElementType,
  HandyUploaderElementConstructor
} from './types'

export type {
  HandyUploaderElementProps,
  HandyUploaderElementConstructor,
  HandyUploaderChangeDetail,
  HandyUploaderAddDetail,
  HandyUploaderRemoveDetail,
  HandyUploaderErrorDetail,
  HandyUploaderEventMap
} from './types'
export type { DocumentAttachment, FileData, LanguageCollection } from '../types'
export type { AttachmentError } from '../core'

const VueHandyUploaderElement = defineCustomElement(HandyUploaderElementComponent, {
  shadowRoot: false
})

// Every prop of the component, i.e. every JS property that can be set on the element.
const PROP_NAMES = Object.keys(HandyUploaderElementComponent.props)

/** The custom element class behind <handy-uploader>. */
export const HandyUploaderElement = class extends VueHandyUploaderElement {
  constructor() {
    super()
    // Vue defines the prop accessors only when the element is connected to the page. Until then
    // `'files' in el` would be false, and React 19 and Svelte 5, which set a value as a property
    // only if it exists on the element (as an attribute otherwise), would turn the first `files`
    // into the string "[object Object]". So every prop is a property from the start: a value set
    // before connecting is stored as a plain property, which Vue picks up on connect (and then
    // replaces with its own accessor). Unset props stay out of Object.keys, so attributes win.
    // Per-instance properties (not prototype accessors calling Vue's private _getProp/_setProp)
    // rely only on Vue reading pre-set own properties on connect, which the test "hands values
    // set before connecting over to Vue" guards against Vue changing.
    for (const name of PROP_NAMES) {
      if (name in this) continue // e.g. `lang` (native) or a value set before the upgrade
      Object.defineProperty(this, name, {
        configurable: true,
        get: () => undefined,
        set(value: unknown) {
          Object.defineProperty(this, name, {
            value,
            configurable: true,
            enumerable: true,
            writable: true
          })
        }
      })
    }
  }
} as unknown as HandyUploaderElementConstructor
export type HandyUploaderElement = HandyUploaderElementType

const STYLE_ID = 'handy-uploader-theme'

/** Adds the default theme to the page once. Called automatically when the element is defined. */
export function injectStyles(doc: Document = document) {
  if (doc.getElementById(STYLE_ID)) return
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.textContent = themeCss
  // First in <head>, so any of your own styles override it.
  doc.head.prepend(style)
}

/**
 * Registers the element under `tagName` (default `handy-uploader`). Safe to call more than
 * once. Pass `{ styles: false }` to skip the default theme.
 */
export function defineHandyUploader(
  tagName = 'handy-uploader',
  { styles = true }: { styles?: boolean } = {}
) {
  if (typeof window === 'undefined' || !window.customElements) return
  if (styles) injectStyles()
  if (customElements.get(tagName)) return
  const base = HandyUploaderElement as unknown as CustomElementConstructor
  // A constructor can only be registered once, so other tag names get their own subclass.
  const ctor = tagName === 'handy-uploader' ? base : class extends base {}
  customElements.define(tagName, ctor)
}

// Importing the module registers <handy-uploader> right away.
defineHandyUploader()

declare global {
  interface HTMLElementTagNameMap {
    'handy-uploader': HandyUploaderElementType
  }
}
