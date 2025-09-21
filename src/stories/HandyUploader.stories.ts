import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import HandyUploader from '../components/handyUploader.vue'
import type { DocumentAttachment, LanguageCollection, FileUploaderType, CardType } from '../types'
import { languages } from '../lib/language'

const meta: Meta<typeof HandyUploader> = {
  title: 'Components/HandyUploader',
  component: HandyUploader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# HandyUploader

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
      name: 'vue-upload-mockup.png',
      format: 'image/png',
      base64: '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VNxW3FjcWtxc3F7cYNxi3GTcZtxo3GrcbNxu3HDcctx03HbceNx63HzcftxA3ILchNyG3IjcityM3I7ckNyS3JTcltyY3JrcnNye3KDcotyk3KbcqNyq3KzcrNyu3LDcstyz3LTcttyz3LjcuNy63LzcvNy+3MDcwtxE3MbcyNzK3MzcztxQ3NLc1NzW3Njc2tzc3N7c4Nzi3OTc5tzo3Orc7Nzu3PDc8tz03Pbc+Nz63Pzc/tz+3QDdAt0E3QbdCN0K3QzdDt0Q3RLdFN0W3RjdGt0c3R7dIN0i3STdJt0o3SrdLN0u3TDdMt003TbdON063TzdPt1A3ULdRN1G3UjdSt1M3U7dUN1S3VTdVt1Y3VrdXN1e3WDdYt1k3WbdaN1q3WzdbN1u3XDdct103XbdeN163XzdfN1+3YDdgt2E3YbdiN2K3YzdjN2O3ZDdkt2U3ZbdmN2a3ZzdnN2e3aDdot2k3abdqN2q3azdrN2u3bDdst203bbduN263bzdvN2+3cDdwt3E3cbdyN3K3czdzN3O3dDd0t3U3dbd2N3a3dzd3N3e3eDd4t3k3ebd6N3q3ezd7N3u3fDd8t303fbd+N363fzd/N3+3QDeAt4E3gbeCN4K3gzeDN4O3hDeEt4U3hbeGN4a3hzeHN4e3iDeIt4k3ibeKN4q3izeLN4u3jDeM',
      size: 2048,
      tags: ['mockup', 'vue', 'upload'],
      description: 'Vue.js upload component mockup',
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
    lang: 'ar',
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

export const PersianLanguage: Story = {
  args: {
    ...Default.args,
    documentAttachment: sampleFiles,
    lang: 'fa',
    rtlSupport: true,
    fileUploaderType: 'thumbnail'
  },
  render: Default.render
}