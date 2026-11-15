// Main entry: 'handy-uploader'
// Framework-free Vue 3 components — no Vuetify needed. Styles: import 'handy-uploader/style.css'.
// The Vuetify-based components live in 'handy-uploader/vuetify'.

import type { App, Component } from 'vue'
import { HandyUploader, HandyDropzone, HandyFileList } from '../vue'

export * from './shared'
export { HandyUploader, HandyDropzone, HandyFileList }
export { useUploader, DEFAULT_UPLOADER_OPTIONS } from '../vue'
export type { UploaderOptions, EditableFields, FileListLayout, FileListLabels } from '../vue'

const components: Record<string, Component> = { HandyUploader, HandyDropzone, HandyFileList }

export default components

/** Vue plugin: app.use(HandyUploaderPlugin) registers the components globally. */
export function install(app: App) {
  for (const [name, component] of Object.entries(components)) app.component(name, component)
}
