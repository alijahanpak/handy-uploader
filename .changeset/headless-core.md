---
'handy-uploader': minor
---

Extract a framework-agnostic core (`src/core`) with no Vue or Vuetify dependency, as the base for future React and other adapters. New exports: `readFiles`, `readFileAsDataUrl`, `prepareAttachments`, `compressDataUrl`, `generateVideoThumbnail`, `getVideoDataUrl` and `createVideoThumbnailCache`, plus their types. `HandyUploader` and `ThumbnailUploader` now use the core internally; their behaviour is unchanged.
