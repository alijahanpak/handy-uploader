# handy-uploader

## 3.1.1

### Patch Changes

- f518381: In the Vuetify version, files that don't match `fileAccept` (for example dropped files) are now rejected with a message instead of being added.

## 3.1.0

### Minor Changes

- 8c54182: Add `<handy-uploader>`, a Web Component that works in any framework (React, Svelte, Angular and others) or in plain HTML. Import it from `handy-uploader/element`.

  - **Self-contained:** Vue is bundled, so nothing else needs to be installed, and the default theme is injected automatically. It renders without Shadow DOM, so `--hu-*` CSS variables and your own CSS apply as usual.
  - **Same features and options as the Vue `HandyUploader`.** Use kebab-case attributes (`file-uploader-type="table"`, `max-file-count="5"`, `tags="invoice, contract"`) or JS properties. The file list is the `files` property.
  - **Events:** `hu-change` (`detail.files`), `hu-add`, `hu-remove` and `hu-error`. They are prefixed so they can't be confused with native `change` events from the inputs inside.
  - TypeScript types without any Vue dependency, including `HTMLElementTagNameMap` support for `document.querySelector('handy-uploader')`.

### Patch Changes

- 3124fb8: Fixes in the Vuetify version (`handy-uploader/vuetify`), found by the new end-to-end tests:

  - `insertPermission: false` now hides the Insert button (it was always shown).
  - The Insert button is disabled once `maxFileCount` is reached.
  - `thumb: false` now turns off image and video previews in the thumbnail view.

## 3.0.0

### Major Changes

- fcd2a95: Fix four long-standing upload bugs. Upgrade notes:

  - **`maxFileSize` is now enforced in bytes, as documented.** Before, the limit was effectively 1000× larger (the 5 MB default let through files up to about 5 GB). If you tuned `maxFileSize` to the old behaviour, divide your value by 1000 or set the byte limit you actually want. The "max file size" alert now shows the correct number of MB.
  - **`imageCompressor` now works.** Before, it never ran. JPEG, PNG and WebP images are re-encoded as JPEG at `imageCompressLevel` and kept only when the result is smaller. A compressed file is stored with `format: 'jpg'` and a `.jpg` name, and transparent areas become white.
  - **`file.size` is always a number of bytes.** Before, it was saved as a string.
  - **File names with several dots are kept whole.** `my.report.pdf` used to be saved as `my.pdf`. Files without an extension are no longer saved as `README.README`.

- 7c48db3: `HandyUploader` no longer needs Vuetify. The main `handy-uploader` import is now a file uploader built from plain HTML and CSS, so it works with Tailwind, Bootstrap, any other styling, or none. The original Vuetify components moved to `handy-uploader/vuetify`.

  **Upgrading from 2.x (Vuetify users):** change your imports. Nothing else changes.

  ```diff
  - import { HandyUploader, ThumbnailUploader } from 'handy-uploader'
  + import { HandyUploader, ThumbnailUploader } from 'handy-uploader/vuetify'
  ```

  Types, utilities and translations are available from both entries. If you register components globally, use the `install` function from `handy-uploader/vuetify`.

  **The new `HandyUploader`** has the same props and events as the Vuetify version: thumbnail, simple and table views; the insert dialog with name, description and tags; the edit dialog; delete confirmation; permissions; card styles; and the count badge. Switching away from Vuetify is a one-line change:

  ```diff
  - import { HandyUploader } from 'handy-uploader/vuetify'
  + import { HandyUploader } from 'handy-uploader'
  + import 'handy-uploader/style.css'
  ```

  - Files can also be dragged and dropped into the insert dialog, and `fileAccept` is checked for dropped files too.
  - Restyle it with `--hu-*` CSS variables or your own classes. Built-in styles use single `hu-*` class selectors, so they hold up against global resets such as Tailwind's preflight. An opt-in `hu-dark` preset is included.
  - File-type icons are inline SVG, so no icon font is needed.
  - `HandyDropzone`, `HandyFileList`, `HandyDialog`, `HandyFileIcon` and the `useUploader()` composable are also exported, for building a fully custom UI.
  - Vuetify is now an optional peer dependency.

  **Build output:** the package now ships ES modules (`.mjs`) and CommonJS (`.cjs`) instead of ES + UMD. The CSS file is exported as `handy-uploader/style.css`.

  SVG previews are also fixed in all uploaders. They used the wrong MIME type (`image/svg` instead of `image/svg+xml`).

### Minor Changes

- fa512b3: Deprecate `useFileUpload` and `useErrorHandler` (from `handy-uploader/vuetify`). They still work, but log a one-time warning and will be removed in the next major version. Use `useUploader` from `handy-uploader` instead: it validates files before reading them, supports drag and drop, image compression, and editing files before they are added. Its `errors` replace `useErrorHandler`.

  The `lang` prop of the framework-free `HandyUploader` now also accepts language keys you add with `customLang`. The README has been rewritten to document the actual API.

- 4eef5c2: Extract a framework-agnostic core (`src/core`) with no Vue or Vuetify dependency, as the base for future React and other adapters. New exports: `readFiles`, `readFileAsDataUrl`, `prepareAttachments`, `compressDataUrl`, `generateVideoThumbnail`, `getVideoDataUrl` and `createVideoThumbnailCache`, plus their types. `HandyUploader` and `ThumbnailUploader` now use the core internally; their behaviour is unchanged.

## 2.0.3

### Patch Changes

- b768cf2: Update Storybook documentation and dev dependencies
