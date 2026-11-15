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

**The new `HandyUploader`:**

```ts
import { HandyUploader } from 'handy-uploader'
import 'handy-uploader/style.css'
```

- Grid, list and table layouts; drag-and-drop with `accept` checking; right-to-left support; and slots for custom items and actions.
- Restyle it with your own classes (all built-in selectors have zero specificity) or with `--hu-*` CSS variables. An opt-in `hu-dark` preset is included.
- `HandyDropzone`, `HandyFileList` and the `useUploader()` composable are also exported, for building a fully custom UI.
- Vuetify is now an optional peer dependency.

**Build output:** the package now ships ES modules (`.mjs`) and CommonJS (`.cjs`) instead of ES + UMD. The CSS file is exported as `handy-uploader/style.css`.

SVG previews are also fixed in all uploaders. They used the wrong MIME type (`image/svg` instead of `image/svg+xml`).
