# Handy Uploader

[![npm version](https://badge.fury.io/js/handy-uploader.svg)](https://badge.fury.io/js/handy-uploader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](https://vuejs.org/)
[![Web Component](https://img.shields.io/badge/Web_Component-React_·_Svelte_·_Angular_·_HTML-29abe2.svg)](#web-component-react-svelte-angular-plain-html)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🚀 [Live Demo](https://alijahanpak.github.io/handy-uploader/)

A file uploader for **Vue, React, Svelte, Angular and plain HTML**, with **automatic video thumbnails**, **image compression**, three layouts (thumbnail, simple, table), per-file names, descriptions and tags, and translations for 5 languages.

It comes in three flavours with **the same options**:

| Import | Use it in | Needs | Styling |
| --- | --- | --- | --- |
| `handy-uploader` | Vue 3 | Vue 3 | Plain CSS, works with any CSS framework (Tailwind, Bootstrap, your own) |
| `handy-uploader/vuetify` | Vue 3 + Vuetify | Vue 3 + Vuetify 3 | Vuetify components |
| `handy-uploader/element` | React, Svelte, Angular, plain HTML, any framework | Nothing (self-contained) | Same plain CSS, injected automatically |

## ✨ Features

- **Video thumbnails:** a frame is captured automatically for MP4, WebM, MOV and other formats the browser can play.
- **Image compression:** optional; JPEG, PNG and WebP are re-encoded as JPEG, and the smaller result is kept.
- **Three views:** `thumbnail` (preview cards), `simple` (compact cards) and `table`.
- **File details:** rename files, and add descriptions and tags before or after upload.
- **Validation:** file size, file count and accepted types, including for drag-and-dropped files.
- **Permissions:** turn insert, edit and delete on or off.
- **Languages:** English, Persian, French, Chinese and Arabic, with right-to-left layout for Persian and Arabic. You can also add your own translations.
- **TypeScript:** full type declarations.

## 📦 Installation

```bash
npm install handy-uploader
```

For the Vuetify flavour, also install `vuetify@^3` (and `@mdi/font` for its icons). The Web Component needs nothing else: Vue is bundled inside it.

## 🚀 Quick Start

### Without Vuetify (any CSS framework)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HandyUploader, type DocumentAttachment } from 'handy-uploader'
import 'handy-uploader/style.css'

const files = ref<DocumentAttachment[]>([])
</script>

<template>
  <HandyUploader
    v-model:document-attachment="files"
    file-uploader-type="thumbnail"
    file-accept="image/*,video/*,.pdf"
    :max-file-size="10 * 1024 * 1024"
    :max-file-count="10"
    change-file-name
    add-file-description
    add-file-tag
    :tags="['invoice', 'contract', 'photo']"
  />
</template>
```

### With Vuetify

```ts
// main.ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'

createApp(App).use(createVuetify()).mount('#app')
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HandyUploader } from 'handy-uploader/vuetify'
import type { DocumentAttachment } from 'handy-uploader/vuetify'

const files = ref<DocumentAttachment[]>([])
</script>

<template>
  <HandyUploader v-model:document-attachment="files" file-uploader-type="table" />
</template>
```

Switching between the two is a one-line change, because the props are the same.

### Web Component (React, Svelte, Angular, plain HTML)

Importing `handy-uploader/element` registers a `<handy-uploader>` element and adds the default theme to the page. Three rules cover every framework:

- **Options are attributes** in kebab-case: `max-file-count="5"`, `change-file-name`, `tags="invoice, contract"`. Booleans accept `"false"`.
- **The file list is the `files` property** (an array), not an attribute.
- **Changes come as DOM events** prefixed with `hu-`: `hu-change` (`event.detail.files`), `hu-add`, `hu-remove` and `hu-error`.

**React 19**

```tsx
import { useState } from 'react'
import 'handy-uploader/element'
import type { DocumentAttachment } from 'handy-uploader/element'

export default function App() {
  const [files, setFiles] = useState<DocumentAttachment[]>([])
  return (
    <handy-uploader
      files={files}
      max-file-count={5}
      change-file-name
      tags="invoice, contract"
      onhu-change={(event) => setFiles(event.detail.files)}
    />
  )
}
```

For TypeScript, declare the element in JSX once; see [examples/react-19/src/handy-uploader.d.ts](examples/react-19/src/handy-uploader.d.ts).

**React 18** doesn't pass properties or custom events to custom elements, so use a ref:

```tsx
const ref = useRef<HandyUploaderElement>(null)
useEffect(() => {
  if (ref.current) ref.current.files = files
}, [files])
useEffect(() => {
  const el = ref.current!
  const onChange = (event: CustomEvent<HandyUploaderChangeDetail>) => setFiles(event.detail.files)
  el.addEventListener('hu-change', onChange)
  return () => el.removeEventListener('hu-change', onChange)
}, [])
// <handy-uploader ref={ref} max-file-count={5} />
```

**Svelte 5**

```svelte
<script>
  import 'handy-uploader/element'
  let files = $state.raw([])
</script>

<handy-uploader
  files={files}
  max-file-count="5"
  onhu-change={(event) => (files = event.detail.files)}
></handy-uploader>
```

**Angular** (standalone component)

```ts
import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core'
import 'handy-uploader/element'
import type { DocumentAttachment, HandyUploaderChangeDetail } from 'handy-uploader/element'

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<handy-uploader
    [files]="files()"
    max-file-count="5"
    (hu-change)="onChange($event)"
  ></handy-uploader>`
})
export class AppComponent {
  readonly files = signal<DocumentAttachment[]>([])
  onChange(event: Event) {
    this.files.set((event as CustomEvent<HandyUploaderChangeDetail>).detail.files)
  }
}
```

**Plain HTML** (no build step)

```html
<handy-uploader id="uploader" max-file-count="5" change-file-name></handy-uploader>

<script type="module">
  import 'https://cdn.jsdelivr.net/npm/handy-uploader@3/dist/element.mjs'

  const el = document.getElementById('uploader')
  el.files = []
  el.addEventListener('hu-change', (event) => console.log(event.detail.files))
</script>
```

The element also has methods for your own drop zones or paste handling: `el.addFiles(files)` (validates and adds, resolves with what was added), `el.removeAt(index)` and `el.openInsert()`. Call them once the element is on the page. Use `defineHandyUploader('my-uploader', { styles: false })` to register it under another tag name or without the default theme.

Complete, tested apps for each framework are in [examples/](examples/).

## 🧭 Framework Support

| Framework | Use |
| --- | --- |
| **Vue 3** (any CSS) | ✅ `handy-uploader` |
| **Vue 3 + Vuetify 3** | ✅ `handy-uploader/vuetify` |
| **React 18 / 19** | ✅ `handy-uploader/element` |
| **Svelte 5** | ✅ `handy-uploader/element` |
| **Angular** | ✅ `handy-uploader/element` |
| **Plain HTML / any other framework** | ✅ `handy-uploader/element` |

Every one of these is covered by browser tests on each pull request. The upload logic (reading files, validation, compression, video thumbnails) lives in a framework-free core that is also exported; see [Building your own UI](#-building-your-own-ui).

## 📚 Documentation

The [live demo](https://alijahanpak.github.io/handy-uploader/) is a Storybook with guides and an interactive example of every feature:

- [Getting Started](https://alijahanpak.github.io/handy-uploader/?path=/docs/guide-getting-started--docs)
- [Feature Tour](https://alijahanpak.github.io/handy-uploader/?path=/docs/guide-feature-tour--docs): every feature, with a link to try it
- [Styling & Theming](https://alijahanpak.github.io/handy-uploader/?path=/docs/guide-styling-theming--docs)
- [Build Your Own UI](https://alijahanpak.github.io/handy-uploader/?path=/docs/guide-build-your-own-ui--docs)
- [Upgrading from 2.x](https://alijahanpak.github.io/handy-uploader/?path=/docs/guide-upgrading-from-2-x--docs)
- [Web Component](https://alijahanpak.github.io/handy-uploader/?path=/docs/web-component-handy-uploader--docs): `<handy-uploader>` with a live event log

## ⚙️ API Reference

### `HandyUploader` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `documentAttachment` | `DocumentAttachment[]` | `[]` | The files. Use with `v-model:document-attachment`, or pass an array. The component updates the array you pass in, as the Vuetify version always has. |
| `fileUploaderType` | `'thumbnail' \| 'simple' \| 'table'` | `'thumbnail'` | Layout. |
| `maxFileSize` | `number` | `5242880` | Maximum size per file, **in bytes** (5 MB). |
| `maxFileCount` | `number` | `10` | Maximum number of files. |
| `fileAccept` | `string` | `''` | Accepted types, in the same format as the HTML `accept` attribute, e.g. `"image/*,.pdf"`. Empty means everything. |
| `imageCompressor` | `boolean` | `false` | Compress JPEG, PNG and WebP images (re-encoded as JPEG, kept only when smaller). |
| `imageCompressLevel` | `number` | `0.8` | JPEG quality, from 0 to 1. |
| `thumb` | `boolean` | `true` | Show image previews and video thumbnails. When off, file-type icons are shown instead. |
| `cols` | `number` | `3` | Thumbnail view: card width out of 12 columns (3 = four per row, 4 = three per row). |
| `cardType` | `'default' \| 'outlined' \| 'raised' \| 'shaped' \| 'tile'` | `'default'` | Card style. |
| `badgeCounter` | `boolean` | `true` | Show the file count on the Insert button. |
| `btnColor` | `string` | `'info'` | Button colour: a Vuetify colour name (`primary`, `info`, `success`, …) or, without Vuetify, any CSS colour. |
| `changeFileName` | `boolean` | `false` | Let users rename files. |
| `addFileDescription` | `boolean` | `false` | Let users add a description. |
| `addFileTag` | `boolean` | `false` | Let users pick tags from `tags`. |
| `tags` | `string[]` | `[]` | Tags users can choose from. |
| `insertPermission` | `boolean` | `true` | Show the Insert button. |
| `editPermission` | `boolean` | `true` | Show the edit button. |
| `deletePermission` | `boolean` | `true` | Show the delete button. Deleting always asks for confirmation. |
| `tableThumbColumn` | `boolean` | `true` | Table view: show the preview column. |
| `tableFixedHeader` | `boolean` | `true` | Table view: keep the header visible while scrolling. |
| `tableHeight` | `number` | `400` | Table view: height in pixels when the header is fixed. |
| `lang` | `string` | `'en'` | Interface language: `en`, `fa`, `fr`, `ch`, `ar`, or a key you add with `customLang`. |
| `customLang` | `LanguageCollection \| null` | `null` | Your own translations (see [Internationalization](#-internationalization)). |
| `rtlSupport` | `boolean` | `false` | Right-to-left layout. Without Vuetify it is also turned on automatically for `fa` and `ar`. With Vuetify, use Vuetify's own RTL setting (`createVuetify({ locale: { rtl: … } })`). |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `updateDocumentAttachment` | `DocumentAttachment[]` | The file list changed (added, edited or removed). |
| `update:documentAttachment` | `DocumentAttachment[]` | Same as above, for `v-model:document-attachment`. *(Not in the Vuetify flavour.)* |
| `add` | `DocumentAttachment[]` | Files were added. *(Not in the Vuetify flavour.)* |
| `remove` | `(attachment, index)` | A file was removed. *(Not in the Vuetify flavour.)* |
| `error` | `AttachmentError[]` | Files were rejected (`fileType`, `maxFileSize`, `maxFileCount`, `invalidFormat`). *(Not in the Vuetify flavour.)* |

When a prop changes, the component also emits a matching `update…` event (e.g. `updateCardType`, `updateLang`), as the 2.x versions did.

### Slots (without Vuetify)

| Slot | Props | Use |
| --- | --- | --- |
| `item` | `{ attachment, index, remove }` | Replace a whole card. |
| `actions` | `{ attachment, index }` | Add your own buttons to each card or row. |
| `empty` | – | Content to show when there are no files. |

### Data types

```ts
interface DocumentAttachment {
  file: FileData
}

interface FileData {
  name: string              // with extension, e.g. "report.pdf"
  format: string            // extension, e.g. "pdf"; "jpg" after compression
  base64: string            // file contents, without the "data:…;base64," prefix
  size: number              // bytes
  tags: string[]
  description: string | null
  showDetailState: boolean
}
```

## 🎨 Styling (without Vuetify)

Import the default theme once:

```ts
import 'handy-uploader/style.css'
```

The easiest way to re-theme is with CSS variables, on the component or any parent:

```css
.hu-uploader {
  --hu-primary: #7c3aed;     /* links, focus, drop area */
  --hu-button-bg: #7c3aed;   /* Insert / Add buttons (or use btnColor) */
  --hu-chip: #7c3aed;        /* size chips */
  --hu-radius: 16px;         /* card corners */
  --hu-media-height: 160px;  /* preview height in the thumbnail view */
  --hu-font: inherit;
}
```

- Add the `hu-dark` class (on the component or a parent) for the dark preset.
- Built-in styles are single `hu-*` class selectors. They survive global resets such as Tailwind's preflight, and are easy to override with your own classes.
- Or skip `style.css` entirely and style the `hu-*` classes yourself.

The default theme uses `color-mix()` and `:has()` (Chrome/Edge 111+, Firefox 121+, Safari 16.4+). In older browsers it still works, with simpler focus and badge styling.

## 🧱 Building your own UI

Everything `HandyUploader` uses is exported:

- **`useUploader(filesRef, options)`:** the upload logic with no markup. It provides `add`, `stage` + `commit` (read files, let users edit them, then add), `remove`, `update`, `clear`, `errors` and `isProcessing`.
- **Components:** `HandyDropzone`, `HandyFileList`, `HandyDialog` and `HandyFileIcon`.
- **Framework-agnostic helpers:** `readFiles`, `prepareAttachments`, `compressDataUrl`, `generateVideoThumbnail`, `matchesAccept`, `formatBytes` and more. These have no Vue dependency.

```ts
import { ref } from 'vue'
import { useUploader, type DocumentAttachment } from 'handy-uploader'

const files = ref<DocumentAttachment[]>([])
const { add, remove, errors, isProcessing } = useUploader(files, {
  maxFileSize: 5 * 1024 * 1024,
  maxFileCount: 10,
  accept: 'image/*',
  imageCompressor: true
})
// <input type="file" multiple @change="add($event.target.files)">
```

## 🌍 Internationalization

Built-in languages: `en` (English), `fa` (Persian, RTL), `fr` (French), `ch` (Chinese), `ar` (Arabic, RTL).

To change texts or add a language, pass `customLang`. Start from the built-in strings:

```ts
import { languageData } from 'handy-uploader'

const customLang = {
  ...languageData,
  de: { ...languageData.en, insertFile: 'Datei hinzufügen', add: 'Hinzufügen' /* … */ }
}
```

```vue
<HandyUploader :custom-lang="customLang" lang="de" />
```

## 🛠️ Requirements

- **Vue** ^3.0.0: for `handy-uploader` and `handy-uploader/vuetify` (the Web Component includes its own)
- **Vuetify** ^3.0.0: optional, only for `handy-uploader/vuetify`
- Modern browsers (Chrome, Edge, Firefox, Safari). Video thumbnails need a browser that can play the video format.

Bundle size (minified, gzipped): `handy-uploader` about 10 KB JS + 3 KB CSS, plus about 6 KB of translations; `handy-uploader/vuetify` about 14 KB (Vue and Vuetify not included); `handy-uploader/element` about 55 KB, everything included.

## ⬆️ Upgrading from 2.x

- **Vuetify users:** change the import to `handy-uploader/vuetify`. Nothing else changes.
- **`maxFileSize` is now enforced in bytes**, as documented. 2.x compared it in kilobytes, so limits were about 1000× looser. If you tuned the value to the old behaviour, divide it by 1000.
- **`file.size` is always a number of bytes.** It used to be a string.
- **The package ships ES modules and CommonJS.** The UMD build was removed.

See [CHANGELOG.md](CHANGELOG.md) for details.

## 🤝 Contributing

1. Fork the repository and create a branch.
2. `npm install`, then `npm run storybook` to work on the components.
3. Run `npm test`, `npm run type-check` and `npm run lint` before opening a pull request. The
   browser tests (`npm run test:e2e`, Playwright: the Storybook stories and the apps in
   `examples/`) need Chromium once: `npx playwright install chromium`.
4. Add a changeset (`npx changeset`) describing your change.

## 📄 License

MIT. See [LICENSE](LICENSE).

## 🔗 Links

- [GitHub repository](https://github.com/alijahanpak/handy-uploader)
- [npm package](https://www.npmjs.com/package/handy-uploader)
- [Live demo (Storybook)](https://alijahanpak.github.io/handy-uploader/)
- [Issues](https://github.com/alijahanpak/handy-uploader/issues)

![npm downloads](https://img.shields.io/npm/dm/handy-uploader.svg)
![GitHub stars](https://img.shields.io/github/stars/alijahanpak/handy-uploader.svg)
