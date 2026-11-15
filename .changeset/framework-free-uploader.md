---
'handy-uploader': major
---

`HandyUploader` no longer needs Vuetify. The main `handy-uploader` import is now a file uploader built from plain HTML and CSS, so it works with Tailwind, Bootstrap, any other styling, or none. The original Vuetify components moved to `handy-uploader/vuetify`.

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
