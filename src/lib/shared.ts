// Exports shared by both entry points ('handy-uploader' and 'handy-uploader/vuetify').

export type {
  FileData,
  DocumentAttachment,
  FileUploaderType,
  CardType,
  LanguageCode,
  FileSizeResult,
  FileIconProps,
  Translation,
  LanguageCollection,
  BaseUploaderProps,
  CardThemeProps,
  HandyUploaderProps,
  UploaderEvents,
  HandyUploaderEvents,
  MimeType,
  ProcessedFile,
  SnackbarConfig
} from '../types'

// File utilities
export {
  formatFileSize,
  getFileType,
  getFileIcon,
  isImageFile,
  validateFileSize,
  validateFileCount,
  getMimeTypeFromExtension,
  constructImageDataUrl,
  compressImage,
  fileToBase64
} from '../core/fileUtils'

// Framework-agnostic core (no Vue or Vuetify)
export {
  readFiles,
  readFileAsDataUrl,
  prepareAttachments,
  compressDataUrl,
  splitFileName,
  joinFileName,
  base64ByteLength,
  COMPRESSIBLE_EXTENSIONS,
  matchesAccept,
  filterByAccept,
  precheckFiles,
  formatBytes,
  generateVideoThumbnail,
  getVideoDataUrl,
  createVideoThumbnailCache
} from '../core'
export type {
  AttachmentError,
  AttachmentErrorCode,
  PrepareOptions,
  PrepareResult,
  CompressFn,
  VideoThumbnailCache
} from '../core'

// Translations
export { languages as languageData } from './language'
