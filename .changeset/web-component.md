---
'handy-uploader': minor
---

Add `<handy-uploader>`, a Web Component that works in any framework (React, Svelte, Angular and others) or in plain HTML. Import it from `handy-uploader/element`.

- **Self-contained:** Vue is bundled, so nothing else needs to be installed, and the default theme is injected automatically. It renders without Shadow DOM, so `--hu-*` CSS variables and your own CSS apply as usual.
- **Same features and options as the Vue `HandyUploader`.** Use kebab-case attributes (`file-uploader-type="table"`, `max-file-count="5"`, `tags="invoice, contract"`) or JS properties. The file list is the `files` property.
- **Events:** `hu-change` (`detail.files`), `hu-add`, `hu-remove` and `hu-error`. They are prefixed so they can't be confused with native `change` events from the inputs inside.
- TypeScript types without any Vue dependency, including `HTMLElementTagNameMap` support for `document.querySelector('handy-uploader')`.
