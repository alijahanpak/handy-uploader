---
'handy-uploader': minor
---

Add `HuUploader`, a file uploader that needs only Vue, with no Vuetify. It is plain HTML and CSS, so it works with Tailwind, Bootstrap or any other styling. Import `handy-uploader/style.css` for the default theme, then restyle it with your own classes or the `--hu-*` CSS variables (all built-in selectors have zero specificity). It offers grid, list and table layouts, drag-and-drop with `accept` checking, an opt-in `hu-dark` preset, right-to-left support, and slots for custom items and actions. `HuDropzone`, `HuFileList` and the `useUploader()` composable are also exported, for building a fully custom UI. Vuetify is now an optional peer dependency.

Also fixes SVG previews, which used the wrong MIME type (`image/svg` instead of `image/svg+xml`) in all uploaders.
