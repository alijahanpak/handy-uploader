// Vuetify entry: 'handy-uploader/vuetify'
// The original Vuetify 3 components. Requires vuetify as a peer dependency.
// For the framework-free components, import from 'handy-uploader' instead.

import type { App, Component } from 'vue'
import ThumbnailUploader from '../components/ThumbnailUploader.vue'
import TableUploader from '../components/TableUploader.vue'
import SimpleUploader from '../components/SimpleUploader.vue'
import HandyUploader from '../components/handyUploader.vue'
import InsertButton from '../components/InsertButton.vue'
import SelectFileIconType from '../components/SelectFileIconType.vue'

export * from './shared'
export { useFileUpload } from '../composables/useFileUpload'
export { useErrorHandler } from '../composables/useErrorHandler'
export {
  ThumbnailUploader,
  TableUploader,
  SimpleUploader,
  HandyUploader,
  InsertButton,
  SelectFileIconType
}

const components: Record<string, Component> = {
  ThumbnailUploader,
  TableUploader,
  SimpleUploader,
  HandyUploader,
  InsertButton,
  SelectFileIconType
}

export default components

/** Vue plugin: app.use(HandyUploaderVuetify) registers the components globally. */
export function install(app: App) {
  for (const [name, component] of Object.entries(components)) app.component(name, component)
}
