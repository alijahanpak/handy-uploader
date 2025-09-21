import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import TableUploader from '../components/TableUploader.vue'
import type { DocumentAttachment, LanguageCollection } from '../types'
import { languages } from '../lib/language'

const meta: Meta<typeof TableUploader> = {
  title: 'Components/TableUploader',
  component: TableUploader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# TableUploader

A table-based file uploader with detailed file information and management capabilities.

## Features
- **Tabular Display**: Organized file information in table format
- **Sortable Columns**: Click column headers to sort files
- **Detailed Information**: File name, size, type, tags, and description
- **Bulk Operations**: Select multiple files for batch operations
- **Thumbnail Column**: Optional thumbnail preview in table
- **Fixed Header**: Keep headers visible while scrolling
- **Internationalization**: Support for multiple languages

## Usage
Ideal for applications that need detailed file management with tabular data presentation.
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

// Sample files for testing with more detailed data
const sampleFiles: DocumentAttachment[] = [
  {
    file: {
      name: 'quarterly-report-2024.pdf',
      format: 'application/pdf',
      base64: '',
      size: 2048000,
      tags: ['report', 'quarterly', '2024', 'finance'],
      description: 'Q1 2024 financial report with detailed analysis and projections',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'team-presentation.pptx',
      format: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      base64: '',
      size: 5120000,
      tags: ['presentation', 'team', 'meeting'],
      description: 'Team meeting presentation for project kickoff',
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
  },
  {
    file: {
      name: 'user-research-data.xlsx',
      format: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      base64: '',
      size: 768000,
      tags: ['research', 'data', 'users', 'analytics'],
      description: 'Comprehensive user research data and insights',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'project-timeline.docx',
      format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      base64: '',
      size: 512000,
      tags: ['timeline', 'project', 'planning'],
      description: 'Detailed project timeline with milestones and deliverables',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'demo-video.mp4',
      format: 'video/mp4',
      base64: '',
      size: 15360000,
      tags: ['video', 'demo', 'product'],
      description: 'Product demonstration video for stakeholders',
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
    components: { TableUploader },
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
      <div style="width: 100%; padding: 20px; min-height: 400px;">
        <TableUploader
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
    components: { TableUploader },
    setup() {
      const files = ref<DocumentAttachment[]>(args.documentAttachment || [])
      
      return {
        args,
        files
      }
    },
    template: `
      <div style="width: 100%; padding: 20px; min-height: 500px;">
        <TableUploader
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

export const LargeDataset: Story = {
  args: {
    documentAttachment: [
      ...sampleFiles,
      ...sampleFiles.map((file, index) => ({
        file: {
          ...file.file,
          name: `${file.file.name.split('.')[0]}-copy-${index + 1}.${file.file.name.split('.')[1]}`,
          description: `Copy ${index + 1} of ${file.file.description}`
        }
      })),
      ...sampleFiles.map((file, index) => ({
        file: {
          ...file.file,
          name: `${file.file.name.split('.')[0]}-backup-${index + 1}.${file.file.name.split('.')[1]}`,
          description: `Backup ${index + 1} of ${file.file.description}`
        }
      }))
    ],
    lang: 'en',
    thumb: true,
    editPermission: true,
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

export const PersianLanguage: Story = {
  args: {
    documentAttachment: sampleFiles,
    lang: 'fa',
    thumb: true,
    editPermission: true,
    deletePermission: true,
    selectedLang: languages as unknown as LanguageCollection
  },
  render: Default.render
}