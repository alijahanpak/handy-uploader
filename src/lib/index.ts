// Main library entry point for handy-uploader npm package

// Import all components
import ThumbnailUploader from '../components/ThumbnailUploader.vue'
import TableUploader from '../components/TableUploader.vue'
import SimpleUploader from '../components/SimpleUploader.vue'
import HandyUploader from '../components/handyUploader.vue'
import InsertButton from '../components/InsertButton.vue'
import SelectFileIconType from '../components/SelectFileIconType.vue'

// Import types
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

// Import utilities
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
} from '../utils/fileUtils'

// Framework-agnostic core (no Vue/Vuetify) — the base for future React/other adapters
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

// Framework-free Vue components (no Vuetify needed). Styles: import 'handy-uploader/style.css'
export { HuUploader, HuDropzone, HuFileList, useUploader, DEFAULT_UPLOADER_OPTIONS } from '../vue'
export type { UploaderOptions, EditableFields, FileListLayout, FileListLabels } from '../vue'
import { HuUploader, HuDropzone, HuFileList } from '../vue'

// Import composables
export { useFileUpload } from '../composables/useFileUpload'
export { useErrorHandler } from '../composables/useErrorHandler'

// Import language utilities
export { languages as languageData } from './language'

// Export components
export {
  ThumbnailUploader,
  TableUploader,
  SimpleUploader,
  HandyUploader,
  InsertButton,
  SelectFileIconType
}

// Default export for convenience
import type { Component } from 'vue'

const components: Record<string, Component> = {
  ThumbnailUploader,
  TableUploader,
  SimpleUploader,
  HandyUploader,
  InsertButton,
  SelectFileIconType,
  HuUploader,
  HuDropzone,
  HuFileList
}

export default components

// Vue plugin installation function
import type { App } from 'vue'

export function install(app: App) {
  app.component('ThumbnailUploader', ThumbnailUploader)
  app.component('TableUploader', TableUploader)
  app.component('SimpleUploader', SimpleUploader)
  app.component('HandyUploader', HandyUploader)
  app.component('InsertButton', InsertButton)
  app.component('SelectFileIconType', SelectFileIconType)
  app.component('HuUploader', HuUploader)
  app.component('HuDropzone', HuDropzone)
  app.component('HuFileList', HuFileList)
}

// Auto-install when used via script tag
declare global {
  interface Window {
    Vue?: App
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}