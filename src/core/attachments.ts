import type { DocumentAttachment } from '../types'
import { getMimeTypeFromExtension } from './fileUtils'

/**
 * Framework-agnostic attachment pipeline: read selected files, then validate and
 * prepare them for the attachment list. Nothing here touches Vue, Vuetify or i18n —
 * errors come back as codes so each UI layer can render its own messages.
 */

export type AttachmentErrorCode = 'maxFileCount' | 'maxFileSize' | 'invalidFormat' | 'fileType'

export interface AttachmentError {
  code: AttachmentErrorCode
  fileName?: string
  limit?: number
}

export interface PrepareOptions {
  /** Number of attachments already in the list. */
  currentCount: number
  maxFileCount: number
  /** Maximum size per file, in bytes. */
  maxFileSize: number
  imageCompressor?: boolean
  /** JPEG quality between 0 and 1. */
  imageCompressLevel?: number
}

export interface PrepareResult {
  accepted: DocumentAttachment[]
  errors: AttachmentError[]
}

export type CompressFn = (dataUrl: string, quality: number) => Promise<string>

/** Extensions that imageCompressor re-encodes as JPEG. */
export const COMPRESSIBLE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

/** Splits "my.report.pdf" into { name: "my.report", format: "pdf" }. */
export function splitFileName(fileName: string): { name: string; format: string } {
  const dot = fileName.lastIndexOf('.')
  // No dot, or a leading dot only (".env"): there is no extension.
  if (dot <= 0) return { name: fileName, format: '' }
  return { name: fileName.substring(0, dot), format: fileName.substring(dot + 1) }
}

/** Joins a base name and extension back together ("README" stays "README"). */
export function joinFileName(name: string, format: string): string {
  return format ? `${name}.${format}` : name
}

/** Size in bytes of the data a base64 string decodes to. */
export function base64ByteLength(base64: string): number {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.floor((base64.length * 3) / 4) - padding
}

/**
 * Checks a file against an `accept` string in the same format as the HTML attribute
 * (".pdf,image/*,application/zip"). An empty string or "*" accepts everything.
 */
export function matchesAccept(file: { name: string; type?: string }, accept = ''): boolean {
  const rules = accept
    .split(',')
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (rules.length === 0 || rules.includes('*') || rules.includes('*/*')) return true

  const extension = `.${splitFileName(file.name).format.toLowerCase()}`
  const mime = (file.type || '').toLowerCase()
  return rules.some((rule) => {
    if (rule.startsWith('.')) return rule === extension
    if (rule.endsWith('/*')) return mime.startsWith(rule.slice(0, -1))
    return rule === mime
  })
}

/** Splits files into those matching `accept` and a `fileType` error for each other one. */
export function filterByAccept(
  files: File[],
  accept = ''
): { accepted: File[]; errors: AttachmentError[] } {
  const accepted: File[] = []
  const errors: AttachmentError[] = []
  for (const file of files) {
    if (matchesAccept(file, accept)) accepted.push(file)
    else errors.push({ code: 'fileType', fileName: file.name })
  }
  return { accepted, errors }
}

export interface PrecheckOptions {
  currentCount: number
  maxFileCount: number
  /** Maximum size per file, in bytes. */
  maxFileSize: number
}

/**
 * Applies the count and size limits using File metadata only, before any file is read,
 * so oversized or surplus files never get loaded into memory.
 */
export function precheckFiles(
  files: File[],
  { currentCount, maxFileCount, maxFileSize }: PrecheckOptions
): { accepted: File[]; errors: AttachmentError[] } {
  const accepted: File[] = []
  const errors: AttachmentError[] = []
  for (const file of files) {
    if (currentCount + accepted.length >= maxFileCount) {
      errors.push({ code: 'maxFileCount', fileName: file.name, limit: maxFileCount })
      break
    }
    if (file.size > maxFileSize) {
      errors.push({ code: 'maxFileSize', fileName: file.name, limit: maxFileSize })
      continue
    }
    accepted.push(file)
  }
  return { accepted, errors }
}

/** Formats a byte count as "12.3 KB" / "4.5 MB", with translatable unit labels. */
export function formatBytes(
  bytes: number,
  units: { kb: string; mb: string } = { kb: 'KB', mb: 'MB' }
) {
  const kb = bytes / 1024
  return kb < 1024 ? `${kb.toFixed(1)} ${units.kb}` : `${(kb / 1024).toFixed(1)} ${units.mb}`
}

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
 * Turns selected files into staged attachments (base name, extension as format, raw
 * base64, size in bytes). Files that cannot be read are skipped.
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
        ...splitFileName(item.name),
        base64: dataUrl.split(',')[1] ?? '',
        size: item.size,
        tags: [],
        description: null,
        showDetailState: false
      }
    })
  }
  return staged
}

/**
 * Re-encodes an image data URL as JPEG at the given quality (0–1). Transparent areas
 * are filled with white, since JPEG has no alpha channel. Browser only.
 */
export function compressDataUrl(dataUrl: string, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const img = document.createElement('img')
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'))
        return
      }
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, img.width, img.height)
      ctx.drawImage(img, 0, 0, img.width, img.height)
      // Browsers return "data:," when the image exceeds their canvas size limit.
      const result = canvas.toDataURL('image/jpeg', quality)
      if (!result.startsWith('data:image/jpeg')) {
        reject(new Error('Canvas could not encode the image'))
        return
      }
      resolve(result)
    }
    img.onerror = () => reject(new Error('Failed to load image for compression'))
    img.src = dataUrl
  })
}

/**
 * Validates staged attachments against the limits and converts them to the shape that
 * is stored in the attachment list. Stops at the file-count limit; skips files that are
 * too large or cannot be processed.
 *
 * With imageCompressor on, JPEG/PNG/WebP images are re-encoded as JPEG; the result is
 * kept only if it is smaller, in which case the stored format becomes "jpg".
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
    const fileName = joinFileName(fileData.name, fileData.format)

    if (currentCount + accepted.length >= maxFileCount) {
      errors.push({ code: 'maxFileCount', fileName, limit: maxFileCount })
      break
    }

    if (fileData.size > maxFileSize) {
      errors.push({ code: 'maxFileSize', fileName, limit: maxFileSize })
      continue
    }

    try {
      let base64 = fileData.base64.replace(/\s/g, '')
      let format = fileData.format
      let size = fileData.size

      if (imageCompressor && COMPRESSIBLE_EXTENSIONS.includes(format.toLowerCase())) {
        const mime = getMimeTypeFromExtension(`file.${format}`)
        const dataUrl = await compress(`data:${mime};base64,${base64}`, quality).catch((error) => {
          console.warn('handy-uploader: compression failed, keeping original', fileName, error)
          return ''
        })
        const compressed = (dataUrl.split(',')[1] ?? '').replace(/\s/g, '')
        const compressedSize = base64ByteLength(compressed)
        // Never replace a file with an empty or failed result; keep the original instead.
        if (compressedSize > 0 && compressedSize < size) {
          base64 = compressed
          format = 'jpg'
          size = compressedSize
        }
      }

      accepted.push({
        file: {
          base64,
          size,
          name: joinFileName(fileData.name, format),
          tags: fileData.tags || [],
          description: fileData.description || '',
          showDetailState: false,
          format
        }
      })
    } catch (error) {
      console.error('handy-uploader: could not process file', fileName, error)
      errors.push({ code: 'invalidFormat', fileName })
    }
  }

  return { accepted, errors }
}
