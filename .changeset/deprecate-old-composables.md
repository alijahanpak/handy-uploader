---
'handy-uploader': minor
---

Deprecate `useFileUpload` and `useErrorHandler` (from `handy-uploader/vuetify`). They still work, but log a one-time warning and will be removed in the next major version. Use `useUploader` from `handy-uploader` instead: it validates files before reading them, supports drag and drop, image compression, and editing files before they are added. Its `errors` replace `useErrorHandler`.

The `lang` prop of the framework-free `HandyUploader` now also accepts language keys you add with `customLang`. The README has been rewritten to document the actual API.
