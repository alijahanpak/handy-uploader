---
'handy-uploader': major
---

Fix four long-standing upload bugs. Upgrade notes:

- **`maxFileSize` is now enforced in bytes, as documented.** Before, the limit was effectively 1000× larger (the 5 MB default let through files up to about 5 GB). If you tuned `maxFileSize` to the old behaviour, divide your value by 1000 or set the byte limit you actually want. The "max file size" alert now shows the correct number of MB.
- **`imageCompressor` now works.** Before, it never ran. JPEG, PNG and WebP images are re-encoded as JPEG at `imageCompressLevel` and kept only when the result is smaller. A compressed file is stored with `format: 'jpg'` and a `.jpg` name, and transparent areas become white.
- **`file.size` is always a number of bytes.** Before, it was saved as a string.
- **File names with several dots are kept whole.** `my.report.pdf` used to be saved as `my.pdf`. Files without an extension are no longer saved as `README.README`.
