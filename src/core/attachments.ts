import type { DocumentAttachment, FileData } from '../types'

/**
 * Framework-agnostic attachment pipeline: read selected files, then validate and
 * prepare them for the attachment list. Nothing here touches Vue, Vuetify or i18n —
 * errors come back as codes so each UI layer can render its own messages.
 *
 * NOTE: this is a faithful port of the logic that lived in handyUploader.vue.
 * Some legacy quirks are preserved on purpose (marked "Legacy") so this refactor
 * does not change behaviour; fix them in a separate, versioned change.
 */

export type AttachmentErrorCode = 'maxFileCount' | 'maxFileSize' | 'invalidFormat'

export interface AttachmentError {
  code: AttachmentErrorCode
  fileName?: string
  limit?: number
}

export interface PrepareOptions {
  /** Number of attachments already in the list. */
  currentCount: number
  maxFileCount: number
  maxFileSize: number
  imageCompressor?: boolean
  imageCompressLevel?: number
}

export interface PrepareResult {
  accepted: DocumentAttachment[]
  errors: AttachmentError[]
}

export type CompressFn = (dataUrl: string, quality: number) => Promise<string>

// Legacy: matched against FileData.format, which holds an extension ("png"), not a MIME
// type — so compression never triggers today.
const COMPRESSIBLE_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp']

/** Reads a Blob as a data URL. */
export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Turns selected files into staged attachments (name without extension, extension as
 * format, raw base64). Files that cannot be read are skipped.
 */
export async function readFiles(files: File[]): Promise<DocumentAttachment[]> {
  const staged: DocumentAttachment[] = []
  for (const item of files) {
    let dataUrl: string
    try {
      dataUrl = await readFileAsDataUrl(item)
    } catch (error) {
      console.warn('handy-uploader: could not read file', item.name, error)
      continue
    }
    staged.push({
      file: {
        // Legacy: drops everything after the first dot ("my.report.pdf" -> "my").
        name: item.name.split('.')[0],
        format: item.name.substring(item.name.lastIndexOf('.') + 1),
        base64: dataUrl.split(',')[1],
        size: item.size,
        tags: [],
        description: null,
        showDetailState: false
      }
    })
  }
  return staged
}

/** Re-encodes an image data URL as JPEG at the given quality (0–1). Browser only. */
export function compressDataUrl(dataUrl: string, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const img = document.createElement('img')
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')?.drawImage(img, 0, 0, img.width, img.height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

/**
 * Validates staged attachments against the limits and converts them to the shape that
 * is stored in the attachment list. Stops at the file-count limit; skips files that are
 * too large or cannot be processed.
 */
export async function prepareAttachments(
  staged: DocumentAttachment[],
  options: PrepareOptions,
  compress: CompressFn = compressDataUrl
): Promise<PrepareResult> {
  const { currentCount, maxFileCount, maxFileSize, imageCompressor = false } = options
  const quality = options.imageCompressLevel ?? 0.8
  const accepted: DocumentAttachment[] = []
  const errors: AttachmentError[] = []

  for (const item of staged) {
    const fileData = item.file

    if (currentCount + accepted.length >= maxFileCount) {
      errors.push({ code: 'maxFileCount', fileName: fileData.name, limit: maxFileCount })
      break
    }

    // Legacy: compares kilobytes against maxFileSize, which is documented in bytes,
    // so the effective limit is ~1000x the configured one.
    if (fileData.size / 1000 > maxFileSize) {
      errors.push({ code: 'maxFileSize', fileName: fileData.name, limit: maxFileSize })
      continue
    }

    try {
      let base64Data = fileData.base64
      let compressed = false
      if (imageCompressor && COMPRESSIBLE_TYPES.includes(fileData.format)) {
        const dataUrl = await compress(`data:${fileData.format};base64,${base64Data}`, quality)
        base64Data = dataUrl.split(',')[1]
        compressed = true
      }

      const sanitized = base64Data.replace(/\s/g, '')
      accepted.push({
        file: {
          base64: sanitized,
          // Legacy: stored as a string (KB when compressed, bytes otherwise) despite
          // FileData.size being typed as a number.
          size: (compressed
            ? (atob(sanitized).length / 1024).toFixed(1)
            : fileData.size.toString()) as unknown as FileData['size'],
          name: `${fileData.name}.${fileData.format}`,
          tags: fileData.tags || [],
          description: fileData.description || '',
          showDetailState: false,
          format: fileData.format
        }
      })
    } catch (error) {
      console.error('handy-uploader: could not process file', fileData.name, error)
      errors.push({ code: 'invalidFormat', fileName: fileData.name })
    }
  }

  return { accepted, errors }
}
