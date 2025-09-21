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
      base64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPCEtLSBDbG91ZCBiYWNrZ3JvdW5kIC0tPgogIDxwYXRoIGQ9Ik0xMDAgMjAwIEMxMDAgMTgwLCAxMjAgMTYwLCAxNDAgMTYwIEMxNTAgMTQwLCAxODAgMTQwLCAxOTAgMTYwIEMyMjAgMTYwLCAyNDAgMTgwLCAyNDAgMjAwIEMyNDAgMjIwLCAyMjAgMjQwLCAxOTAgMjQwIEwxNDAgMjQwIEMxMjAgMjQwLCAxMDAgMjIwLCAxMDAgMjAwIFoiIGZpbGw9IiM0RkMwOEQiIHN0cm9rZT0iIzRGQzA4RCIgc3Ryb2tlLXdpZHRoPSI4IiBvcGFjaXR5PSIwLjkiLz4KICA8IS0tIENsb3VkIGlubmVyIGFyZWEgLS0+CiAgPHBhdGggZD0iTTExMCAyMDAgQzExMCAxODUsIDEyNSAxNzAsIDE0MCAxNzAgQzE0OCAxNTUsIDE3MiAxNTUsIDE4MCAxNzAgQzIwNSAxNzAsIDIyMCAxODUsIDIyMCAyMDAgQzIyMCAyMTUsIDIwNSAyMzAsIDE4MCAyMzAgTDE0MCAyMzAgQzEyNSAyMzAsIDExMCAyMTUsIDExMCAyMDAgWiIgZmlsbD0id2hpdGUiLz4KICA8IS0tIFZ1ZS5qcyBsb2dvIC0tPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2MCwgMTgwKSBzY2FsZSgwLjgpIj4KICAgIDwhLS0gVnVlLmpzIFYgc2hhcGUgLS0+CiAgICA8cGF0aCBkPSJNLTIwIC0xNSBMMCAxNSBMMjAgLTE1IEwxMiAtMTUgTDAgNSBMLTEyIC0xNSBaIiBmaWxsPSIjNEZDMDhEIi8+CiAgICA8cGF0aCBkPSJNLTEyIC0xNSBMMCA1IEwxMiAtMTUgTDggLTE1IEwwIC0yIEwtOCAtMTUgWiIgZmlsbD0iIzM1NDk1RSIvPgogIDwvZz4KICA8IS0tIFVwbG9hZCBhcnJvdyAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMjAsIDI4MCkiPgogICAgPCEtLSBBcnJvdyBzaGFmdCAtLT4KICAgIDxyZWN0IHg9Ii00IiB5PSItMzAiIHdpZHRoPSI4IiBoZWlnaHQ9IjI1IiBmaWxsPSIjNEZDMDhEIi8+CiAgICA8IS0tIEFycm93IGhlYWQgLS0+CiAgICA8cGF0aCBkPSJNLTEyIC0yNSBMMCAtNDAgTDEyIC0yNSBaIiBmaWxsPSIjNEZDMDhEIi8+CiAgPC9nPgo8L3N2Zz4=',
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