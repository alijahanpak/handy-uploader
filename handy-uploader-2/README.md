# Handy Uploader

[![npm version](https://badge.fury.io/js/handy-uploader.svg)](https://badge.fury.io/js/handy-uploader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## 🚀 [Live Demo](https://friendly-varahamihira-45c09f.netlify.app)

A comprehensive Vue 3 file uploader component library with advanced features including **automatic video thumbnail generation**, multiple upload styles, and extensive file type support.

## ✨ Key Features

### 🎥 **Video Thumbnail Generation**
- **Automatic thumbnail extraction** from video files using Canvas API
- Support for **MP4, AVI, MOV, WMV, FLV, WebM** formats
- Real-time thumbnail display with play button overlay
- No external dependencies required

### 📁 **Comprehensive File Support**
- **Images**: JPG, JPEG, PNG, GIF, BMP, SVG, WebP, TIFF
- **Videos**: MP4, AVI, MOV, WMV, FLV, WebM
- **Documents**: PDF, DOC, DOCX, TXT, RTF, ODT
- **Spreadsheets**: XLS, XLSX, CSV, ODS
- **Presentations**: PPT, PPTX, ODP
- **Archives**: ZIP, RAR, 7Z, TAR, GZ
- **Audio**: MP3, WAV, FLAC, AAC, OGG

### 🎨 **Multiple Upload Styles**
- **ThumbnailUploader**: Grid-based layout with file previews
- **TableUploader**: Table-based layout for detailed file information
- **SimpleUploader**: Minimalist drag-and-drop interface

### 🌍 **Internationalization**
- **8 languages**: English, Chinese, Spanish, French, German, Japanese, Korean, Arabic
- RTL support for Arabic
- Easy language switching

## 📦 Installation

```bash
npm install handy-uploader
```

```bash
yarn add handy-uploader
```

```bash
pnpm add handy-uploader
```

## 🚀 Quick Start

### 1. Install Dependencies

Make sure you have the required peer dependencies:

```bash
npm install vue@^3.0.0 vuetify@^3.0.0
```

### 2. Import and Use

```vue
<template>
  <div>
    <!-- Thumbnail Uploader with Video Support -->
    <ThumbnailUploader
      :max-file-size="10485760"
      :max-file-count="5"
      :accepted-file-types="['image/*', 'video/*']"
      :language="'en'"
      @files-selected="handleFilesSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ThumbnailUploader } from 'handy-uploader'
import type { FileData } from 'handy-uploader'

const handleFilesSelected = (files: FileData[]) => {
  console.log('Selected files:', files)
  // Each file includes base64 data and video thumbnails are auto-generated
}
</script>
```

### 3. Setup Vuetify (Required)

```typescript
// main.ts
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify()
const app = createApp(App)

app.use(vuetify)
app.mount('#app')
```

## 📖 Component Usage

### ThumbnailUploader (Recommended)

Perfect for media files with automatic video thumbnail generation:

```vue
<template>
  <ThumbnailUploader
    :max-file-size="52428800"
    :max-file-count="10"
    :accepted-file-types="['image/*', 'video/*', 'application/pdf']"
    :language="'en'"
    :theme="'light'"
    @files-selected="onFilesSelected"
    @file-removed="onFileRemoved"
    @error="onError"
  />
</template>

<script setup>
import { ThumbnailUploader } from 'handy-uploader'

const onFilesSelected = (files) => {
  // Video files will have thumbnails automatically generated
  files.forEach(file => {
    if (file.type === 'video') {
      console.log('Video thumbnail:', file.thumbnail) // Base64 thumbnail
    }
  })
}
</script>
```

### TableUploader

Great for document management with detailed file information:

```vue
<template>
  <TableUploader
    :max-file-size="104857600"
    :max-file-count="20"
    :language="'en'"
    @files-selected="handleFiles"
  />
</template>
```

### SimpleUploader

Minimal drag-and-drop interface:

```vue
<template>
  <SimpleUploader
    :max-file-size="5242880"
    :accepted-file-types="['image/*']"
    @files-selected="handleImages"
  />
</template>
```

## ⚙️ API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxFileSize` | `number` | `10485760` | Maximum file size in bytes (10MB) |
| `maxFileCount` | `number` | `5` | Maximum number of files |
| `acceptedFileTypes` | `string[]` | `['*']` | Accepted MIME types |
| `language` | `string` | `'en'` | Language code |
| `theme` | `string` | `'light'` | Theme variant |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `files-selected` | `FileData[]` | Emitted when files are selected |
| `file-removed` | `FileData` | Emitted when a file is removed |
| `error` | `Error` | Emitted on errors |

### FileData Interface

```typescript
interface FileData {
  id: string
  name: string
  size: number
  type: string
  format: string
  base64?: string
  thumbnail?: string  // Auto-generated for videos
  lastModified: number
}
```

## 🎯 Advanced Features

### Video Thumbnail Generation

The library automatically generates thumbnails for video files:

```javascript
// Thumbnails are generated automatically
const videoFile = {
  name: 'video.mp4',
  type: 'video',
  thumbnail: 'data:image/jpeg;base64,/9j/4AAQ...' // Auto-generated
}
```

### File Type Detection

Automatic file type detection and icon assignment:

```javascript
// Automatic type detection
const file = {
  name: 'document.pdf',
  type: 'document',  // Auto-detected
  icon: 'mdi-file-pdf-box',  // Auto-assigned
  color: 'red'  // Auto-assigned
}
```

### Image Compression

Built-in image compression for large files:

```vue
<ThumbnailUploader
  :compress-images="true"
  :compression-quality="0.8"
  :max-width="1920"
  :max-height="1080"
/>
```

## 🌍 Internationalization

Supported languages:

```javascript
const languages = [
  'en', // English
  'zh', // Chinese
  'es', // Spanish
  'fr', // French
  'de', // German
  'ja', // Japanese
  'ko', // Korean
  'ar'  // Arabic (RTL)
]
```

## 🛠️ Technical Requirements

### Peer Dependencies
- **Vue**: ^3.0.0
- **Vuetify**: ^3.0.0

### Browser Support
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Bundle Size
- **Gzipped**: ~45KB
- **Minified**: ~120KB

## 🎨 Customization

### Theming

Works with Vuetify's theming system:

```javascript
// vuetify.config.js
export default createVuetify({
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        // Custom theme colors
      }
    }
  }
})
```

### Custom Styling

```vue
<style scoped>
.handy-uploader {
  --uploader-border-radius: 12px;
  --uploader-primary-color: #1976D2;
  --uploader-background: #f5f5f5;
}
</style>
```

## 📝 Examples

### Complete Example with All Features

```vue
<template>
  <div class="uploader-container">
    <h2>File Upload with Video Thumbnails</h2>
    
    <ThumbnailUploader
      :max-file-size="52428800"
      :max-file-count="10"
      :accepted-file-types="['image/*', 'video/*', 'application/pdf']"
      :language="currentLanguage"
      :theme="isDark ? 'dark' : 'light'"
      :compress-images="true"
      :compression-quality="0.8"
      @files-selected="handleFilesSelected"
      @file-removed="handleFileRemoved"
      @error="handleError"
    />
    
    <!-- Display selected files -->
    <div v-if="selectedFiles.length" class="mt-4">
      <h3>Selected Files:</h3>
      <div v-for="file in selectedFiles" :key="file.id" class="file-item">
        <img v-if="file.thumbnail" :src="file.thumbnail" alt="Thumbnail" width="100" />
        <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ThumbnailUploader, type FileData } from 'handy-uploader'

const selectedFiles = ref<FileData[]>([])
const currentLanguage = ref('en')
const isDark = ref(false)

const handleFilesSelected = (files: FileData[]) => {
  selectedFiles.value = files
  console.log('Files with thumbnails:', files)
}

const handleFileRemoved = (file: FileData) => {
  console.log('File removed:', file.name)
}

const handleError = (error: Error) => {
  console.error('Upload error:', error)
}

const formatFileSize = (bytes: number) => {
  return bytes > 1024 * 1024 
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(2)} KB`
}
</script>
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/alijahanpak/vue-file-uploader)
- [npm Package](https://www.npmjs.com/package/handy-uploader)
- [Issues](https://github.com/alijahanpak/vue-file-uploader/issues)

## 📊 Stats

![npm downloads](https://img.shields.io/npm/dm/handy-uploader.svg)
![GitHub stars](https://img.shields.io/github/stars/alijahanpak/handy-uploader.svg)
![GitHub issues](https://img.shields.io/github/issues/alijahanpak/handy-uploader.svg)

---

**Made with ❤️ for the Vue.js community**
