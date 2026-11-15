---
'handy-uploader': patch
---

Fixes in the Vuetify version (`handy-uploader/vuetify`), found by the new end-to-end tests:

- `insertPermission: false` now hides the Insert button (it was always shown).
- The Insert button is disabled once `maxFileCount` is reached.
- `thumb: false` now turns off image and video previews in the thumbnail view.
