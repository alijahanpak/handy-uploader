import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import HandyUploader from '../components/handyUploader.vue'
import type { DocumentAttachment } from '../types'

const meta: Meta<typeof HandyUploader> = {
  title: 'Components/HandyUploader',
  component: HandyUploader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `

The main file uploader component that combines all uploader types with comprehensive configuration options.

## Features
- **Multiple Upload Types**: Simple, Table, and Thumbnail views
- **Drag & Drop Support**: Intuitive file selection
- **File Compression**: Built-in image compression
- **File Validation**: Size and count limits
- **Internationalization**: Support for multiple languages
- **Customizable UI**: Various card styles and themes
- **File Management**: Add, edit, delete, and tag files
- **RTL Support**: Right-to-left language support

## Upload Types
- **Simple**: Clean minimal interface
- **Table**: Detailed tabular view with sorting
- **Thumbnail**: Grid-based visual preview

## Usage
The most versatile component for all file upload needs with extensive customization options.
        `
      }
    }
  },
  argTypes: {
    documentAttachment: {
      description: 'Array of uploaded files',
      control: { type: 'object' }
    },
    fileUploaderType: {
      description: 'Type of uploader interface',
      control: { type: 'select' },
      options: ['simple', 'table', 'thumbnail'],
      defaultValue: 'thumbnail'
    },
    lang: {
      description: 'Language code for internationalization',
      control: { type: 'select' },
      options: ['en', 'fa', 'fr', 'ch', 'ar'],
      defaultValue: 'en'
    },
    maxFileSize: {
      description: 'Maximum file size in bytes',
      control: { type: 'number' },
      defaultValue: 5000000
    },
    maxFileCount: {
      description: 'Maximum number of files allowed',
      control: { type: 'number' },
      defaultValue: 10
    },
    thumb: {
      description: 'Show thumbnails for image files',
      control: { type: 'boolean' },
      defaultValue: true
    },
    cols: {
      description: 'Number of columns in thumbnail grid',
      control: { type: 'range', min: 1, max: 12, step: 1 },
      defaultValue: 4
    },
    cardType: {
      description: 'Card styling type',
      control: { type: 'select' },
      options: ['default', 'outlined', 'shaped', 'raised', 'tile'],
      defaultValue: 'default'
    },
    badgeCounter: {
      description: 'Show file count badge',
      control: { type: 'boolean' },
      defaultValue: true
    },
    btnColor: {
      description: 'Upload button color',
      control: { type: 'color' },
      defaultValue: 'primary'
    },
    imageCompressor: {
      description: 'Enable image compression',
      control: { type: 'boolean' },
      defaultValue: false
    },
    imageCompressLevel: {
      description: 'Image compression level (0-1)',
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      defaultValue: 0.8
    },
    fileAccept: {
      description: 'Accepted file types',
      control: { type: 'text' },
      defaultValue: '*'
    },
    tableThumbColumn: {
      description: 'Show thumbnail column in table view',
      control: { type: 'boolean' },
      defaultValue: true
    },
    tableFixedHeader: {
      description: 'Fixed header in table view',
      control: { type: 'boolean' },
      defaultValue: false
    },
    tableHeight: {
      description: 'Table height in pixels',
      control: { type: 'number' },
      defaultValue: 400
    },
    rtlSupport: {
      description: 'Right-to-left language support',
      control: { type: 'boolean' },
      defaultValue: false
    },
    changeFileName: {
      description: 'Allow changing file names',
      control: { type: 'boolean' },
      defaultValue: true
    },
    addFileDescription: {
      description: 'Allow adding file descriptions',
      control: { type: 'boolean' },
      defaultValue: true
    },
    addFileTag: {
      description: 'Allow adding file tags',
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
    },
    insertPermission: {
      description: 'Allow inserting new files',
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
      name: 'project-proposal.pdf',
      format: 'application/pdf',
      base64: '',
      size: 2048000,
      tags: ['proposal', 'project', 'business'],
      description: 'Comprehensive project proposal document',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'vue-upload-mockup.svg',
      format: 'image/svg+xml',
      base64: 'PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNENBRjUwO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyMTk2RjM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICAKICA8IS0tIEJhY2tncm91bmQgLS0+CiAgPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjYmcpIiByeD0iOCIvPgogIAogIDwhLS0gVXBsb2FkIGFyZWEgLS0+CiAgPHJlY3QgeD0iNTAiIHk9IjUwIiB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC45IiByeD0iNCIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjUsNSIvPgogIAogIDwhLS0gVXBsb2FkIGljb24gLS0+CiAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTIwIiByPSIyNSIgZmlsbD0iIzRDQUY1MCIvPgogIDxwYXRoIGQ9Ik0xOTAgMTIwIEwyMDAgMTEwIEwyMTAgMTIwIE0yMDAgMTEwIEwyMDAgMTM1IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZmlsbD0ibm9uZSIvPgogIAogIDwhLS0gVGV4dCAtLT4KICA8dGV4dCB4PSIyMDAiIHk9IjE3MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzMzIj5WdWUgVXBsb2FkIE1vY2t1cDwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjE5MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2Ij5EcmFnICYgRHJvcCBGaWxlcyBIZXJlPC90ZXh0PgogIAogIDwhLS0gVnVlLmpzIGxvZ28gc3R5bGUgLS0+CiAgPHBvbHlnb24gcG9pbnRzPSIyMDAsMjIwIDE4NSwyNDUgMjE1LDI0NSIgZmlsbD0iIzRGQzA4RCIvPgogIDxwb2x5Z29uIHBvaW50cz0iMjAwLDIyNSAxOTAsMjQwIDIxMCwyNDAiIGZpbGw9IiMzNTQ5NUUiLz4KPC9zdmc+',
      size: 1250,
      tags: ['vue', 'upload', 'mockup'],
      description: 'Vue Upload component mockup',
      showDetailState: false
    }
  },
  {
    file: {
      name: 'data-analysis.xlsx',
      format: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      base64: '',
      size: 768000,
      tags: ['data', 'analysis', 'spreadsheet'],
      description: 'Monthly data analysis report',
      showDetailState: false
    }
  }
]

export const Default: Story = {
  args: {
    documentAttachment: [],
    fileUploaderType: 'thumbnail',
    lang: 'en',
    maxFileSize: 5000000,
    maxFileCount: 10,
    thumb: true,
    cols: 4,
    cardType: 'default',
    badgeCounter: true,
    btnColor: 'primary',
    imageCompressor: false,
    imageCompressLevel: 0.8,
    fileAccept: '*',
    tableThumbColumn: true,
    tableFixedHeader: false,
    tableHeight: 400,
    rtlSupport: false,
    changeFileName: true,
    addFileDescription: true,
    addFileTag: true,
    editPermission: true,
    deletePermission: true,
    insertPermission: true
  },
  render: (args) => ({
    components: { HandyUploader },
    setup() {
      const files = ref<DocumentAttachment[]>(args.documentAttachment || [])
      
      return {
        args,
        files
      }
    },
    template: `
      <div style="width: 100%; padding: 20px; min-height: 600px;">
        <HandyUploader
          v-bind="args"
          v-model:document-attachment="files"
        />
      </div>
    `
  })
}

export const ThumbnailView: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    fileUploaderType: 'thumbnail',
    cols: 3
  },
  render: Default.render
}

export const TableView: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    fileUploaderType: 'table',
    tableFixedHeader: true,
    tableHeight: 300
  },
  render: Default.render
}

export const SimpleView: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    fileUploaderType: 'simple'
  },
  render: Default.render
}

export const WithImageCompression: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    imageCompressor: true,
    imageCompressLevel: 0.6,
    fileAccept: 'image/*'
  },
  render: Default.render
}

export const OutlinedCards: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    cardType: 'outlined',
    fileUploaderType: 'thumbnail'
  },
  render: Default.render
}

export const RaisedCards: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    cardType: 'raised',
    fileUploaderType: 'thumbnail'
  },
  render: Default.render
}

export const RestrictedFileTypes: Story = {
  args: {
    ...Default.args,
    fileAccept: '.pdf,.doc,.docx,.jpg,.png',
    maxFileSize: 2000000,
    maxFileCount: 5
  },
  render: Default.render
}

export const ReadOnlyMode: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    editPermission: false,
    deletePermission: false,
    insertPermission: false
  },
  render: Default.render
}

export const MinimalFeatures: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    badgeCounter: false,
    changeFileName: false,
    addFileDescription: false,
    addFileTag: false,
    thumb: false
  },
  render: Default.render
}

export const RTLSupport: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    lang: 'fr',
    rtlSupport: true,
    fileUploaderType: 'thumbnail'
  },
  render: Default.render
}

export const FrenchLanguage: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    lang: 'fr',
    fileUploaderType: 'table'
  },
  render: Default.render
}