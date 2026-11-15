// Files generated in the tests, for setInputFiles, drops and addFiles.

export interface TestFile {
  name: string
  mimeType: string
  buffer: Buffer
}

/** A valid 8×8 red PNG. */
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAEUlEQVR4nGO4IyeHFTEMLQkAid1GAXiz9Rc' +
  'AAAAASUVORK5CYII='

/** A minimal, valid one-page PDF. */
const PDF = [
  '%PDF-1.4',
  '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
  '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj',
  'trailer<</Root 1 0 R>>',
  '%%EOF',
  ''
].join('\n')

export const png = (name = 'photo.png'): TestFile => ({
  name,
  mimeType: 'image/png',
  buffer: Buffer.from(PNG_BASE64, 'base64')
})

export const pdf = (name = 'report.pdf'): TestFile => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.from(PDF)
})

export const txt = (name = 'notes.txt', text = 'Some notes\n'): TestFile => ({
  name,
  mimeType: 'text/plain',
  buffer: Buffer.from(text)
})

/** A PDF padded to `bytes` bytes, for the size limit. */
export const bigPdf = (name: string, bytes: number): TestFile => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.concat([Buffer.from(PDF), Buffer.alloc(Math.max(0, bytes - PDF.length), 0x20)])
})

/** The same file in a form that can be passed into page.evaluate (Buffers can't). */
export const serialisable = (file: TestFile) => ({
  name: file.name,
  mimeType: file.mimeType,
  base64: file.buffer.toString('base64')
})
