import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SimpleUploader from '../components/SimpleUploader.vue'
import type { DocumentAttachment, LanguageCollection } from '../types'
import { languages } from '../lib/language'

const meta: Meta<typeof SimpleUploader> = {
  title: 'Components/SimpleUploader',
  component: SimpleUploader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# SimpleUploader

A clean and minimal file uploader component with essential functionality.

## Features
- **Drag & Drop Support**: Intuitive file selection
- **Multiple File Types**: Support for various file formats
- **File Management**: Basic add, edit, and delete operations
- **Internationalization**: Support for multiple languages
- **Lightweight**: Minimal UI with essential features

## Usage
Perfect for applications that need basic file upload functionality without complex UI elements.
        `
      }
    }
  },
  argTypes: {
    documentAttachment: {
      description: 'Array of uploaded files',
      control: { type: 'object' }
    },
    lang: {
      description: 'Language code for internationalization',
      control: { type: 'select' },
      options: ['en', 'fa', 'fr', 'ch', 'ar'],
      defaultValue: 'en'
    },
    thumb: {
      description: 'Show thumbnails for image files',
      control: { type: 'boolean' },
      defaultValue: true
    },
    editPermission: {
      description: 'Allow editing file details',
      control: { type: 'boolean' },
      defaultValue: true
    },
    deletePermission: {
      description: 'Allow deleting files',
      control: { type: 'boolean' },
      defaultValue: true
    }
  },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

// Sample files for testing
const sampleFiles: DocumentAttachment[] = [
  {
    file: {
      name: 'document.pdf',
      format: 'application/pdf',
      base64: '',
      size: 1024000,
      tags: ['document', 'important'],
      description: 'Important business document',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'presentation.pptx',
      format: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      base64: '',
      size: 2048000,
      tags: ['presentation', 'meeting'],
      description: 'Quarterly review presentation',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'vue-upload-mockup.png',
      format: 'image/png',
      base64: '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VNxW3FjcWtxc3F7cYNxi3GTcZtxo3GrcbNxu3HDcctx03HbceNx63HzcftxA3ILchNyG3IjcityM3I7ckNyS3JTcltyY3JrcnNye3KDcotyk3KbcqNyq3KzcrNyu3LDcstyz3LTcttyz3LjcuNy63LzcvNy+3MDcwtxE3MbcyNzK3MzcztxQ3NLc1NzW3Njc2tzc3N7c4Nzi3OTc5tzo3Orc7Nzu3PDc8tz03Pbc+Nz63Pzc/tz+3QDdAt0E3QbdCN0K3QzdDt0Q3RLdFN0W3RjdGt0c3R7dIN0i3STdJt0o3SrdLN0u3TDdMt003TbdON063TzdPt1A3ULdRN1G3UjdSt1M3U7dUN1S3VTdVt1Y3VrdXN1e3WDdYt1k3WbdaN1q3WzdbN1u3XDdct103XbdeN163XzdfN1+3YDdgt2E3YbdiN2K3YzdjN2O3ZDdkt2U3ZbdmN2a3ZzdnN2e3aDdot2k3abdqN2q3azdrN2u3bDdst203bbduN263bzdvN2+3cDdwt3E3cbdyN3K3czdzN3O3dDd0t3U3dbd2N3a3dzd3N3e3eDd4t3k3ebd6N3q3ezd7N3u3fDd8t303fbd+N363fzd/N3+3QDeAt4E3gbeCN4K3gzeDN4O3hDeEt4U3hbeGN4a3hzeHN4e3iDeIt4k3ibeKN4q3izeLN4u3jDeM',
      size: 2048,
      tags: ['mockup', 'vue', 'upload'],
      description: 'Vue.js upload component mockup',
      showDetailState: false
    }
  }
]

export const Default: Story = {
  args: {
    documentAttachment: [],
    lang: 'en',
    thumb: true,
    editPermission: true,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: (args) => ({
    components: { SimpleUploader },
    setup() {
      const files = ref<DocumentAttachment[]>(args.documentAttachment || [])
      
      const handleOpenDeleteDialog = (index: number, deleteId: string) => {
        console.log('Delete dialog opened for:', index, deleteId)
      }
      
      const handleOpenEditDialog = (item: DocumentAttachment, index: number) => {
        console.log('Edit dialog opened for:', item, index)
      }
      
      return {
        args,
        files,
        handleOpenDeleteDialog,
        handleOpenEditDialog
      }
    },
    template: `
      <div style="width: 600px; padding: 20px;">
        <SimpleUploader
          v-bind="args"
          :document-attachment="files"
          @open-delete-dialog="handleOpenDeleteDialog"
          @open-edit-document-dialog="handleOpenEditDialog"
        />
      </div>
    `
  })
}

export const WithFiles: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'en',
    thumb: true,
    editPermission: true,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: (args) => ({
    components: { SimpleUploader },
    setup() {
      const files = ref<DocumentAttachment[]>(args.documentAttachment || [])
      
      return {
        args,
        files
      }
    },
    template: `
      <div style="width: 600px; padding: 20px;">
        <SimpleUploader
          v-bind="args"
          :document-attachment="files"
        />
      </div>
    `
  })
}

export const NoThumbnails: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'en',
    thumb: false,
    editPermission: true,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}

export const ReadOnly: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'en',
    thumb: true,
    editPermission: false,
    deletePermission: false,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}

export const EditOnly: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'en',
    thumb: true,
    editPermission: true,
    deletePermission: false,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}

export const DeleteOnly: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'en',
    thumb: true,
    editPermission: false,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}

export const FrenchLanguage: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'fr',
    thumb: true,
    editPermission: true,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}

export const ArabicLanguage: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'ar',
    thumb: true,
    editPermission: true,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}