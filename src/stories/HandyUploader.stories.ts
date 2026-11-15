import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import HandyUploader from '../vue/components/HandyUploader.vue'
import '../vue/theme.css'
import type { DocumentAttachment } from '../types'

const meta: Meta<typeof HandyUploader> = {
  title: 'Components/HandyUploader',
  component: HandyUploader,
  parameters: {
    docs: {
      description: {
        component: `
Framework-free uploader: plain HTML + CSS, no Vuetify. Import \`handy-uploader/style.css\`
for the default look, then restyle it with your own classes or the \`--hu-*\` CSS variables.
Built-in styles are single \`hu-*\` classes, so they survive global resets and are easy to override.`
      }
    }
  },
  argTypes: {
    layout: { control: 'select', options: ['grid', 'list', 'table'] },
    lang: { control: 'select', options: ['en', 'fa', 'fr', 'ch', 'ar'] },
    maxFileSize: { control: 'number', description: 'Bytes' },
    maxFileCount: { control: 'number' },
    accept: { control: 'text' },
    imageCompressor: { control: 'boolean' },
    imageCompressLevel: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
    removable: { control: 'boolean' },
    thumbnails: { control: 'boolean' },
    disabled: { control: 'boolean' }
  },
  args: {
    layout: 'grid',
    lang: 'en',
    maxFileSize: 5 * 1024 * 1024,
    maxFileCount: 10,
    accept: '',
    imageCompressor: false,
    imageCompressLevel: 0.8,
    removable: true,
    thumbnails: true,
    disabled: false
  },
  render: (args) => ({
    components: { HandyUploader },
    setup() {
      const files = ref<DocumentAttachment[]>(args.modelValue ?? [])
      return { args, files }
    },
    template: `
      <div style="max-width: 760px; padding: 24px;">
        <HandyUploader v-bind="args" v-model="files" />
        <pre style="margin-top: 16px; font-size: 12px; color: #656d76;">{{ files.length }} file(s) in v-model</pre>
      </div>
    `
  })
}

export default meta
type Story = StoryObj<typeof meta>

const svg = (color: string, label: string) =>
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="${color}"/><text x="160" y="112" font-family="sans-serif" font-size="28" fill="white" text-anchor="middle">${label}</text></svg>`
  )

const attachment = (name: string, format: string, size: number, base64 = ''): DocumentAttachment => ({
  file: { name, format, base64, size, tags: [], description: '', showDetailState: false }
})

const sampleFiles: DocumentAttachment[] = [
  attachment('mountains.svg', 'svg', 48_213, svg('#2f81f7', 'mountains')),
  attachment('sunset.svg', 'svg', 51_900, svg('#bf3989', 'sunset')),
  attachment('quarterly report 2026.pdf', 'pdf', 2_480_000),
  attachment('budget.xlsx', 'xlsx', 88_000),
  attachment('slides.pptx', 'pptx', 5_100_000),
  attachment('archive.zip', 'zip', 12_000_000)
]

export const Grid: Story = {}

export const WithFiles: Story = { args: { modelValue: sampleFiles } }

export const TableWithFiles: Story = { args: { modelValue: sampleFiles, layout: 'table' } }

export const List: Story = { args: { layout: 'list' } }

export const Table: Story = { args: { layout: 'table' } }

export const ImagesOnly: Story = {
  args: { accept: 'image/*', imageCompressor: true, imageCompressLevel: 0.6 }
}

export const Persian: Story = { args: { lang: 'fa' } }

export const Dark: Story = {
  render: (args) => ({
    components: { HandyUploader },
    setup: () => ({ args, files: ref<DocumentAttachment[]>([]) }),
    template: `
      <div class="hu-dark" style="background: #0d1117; padding: 24px; max-width: 760px;">
        <HandyUploader v-bind="args" v-model="files" />
      </div>
    `
  })
}

export const CustomTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Re-themed with nothing but CSS variables, the way you would match any design system.'
      }
    }
  },
  render: (args) => ({
    components: { HandyUploader },
    setup: () => ({ args, files: ref<DocumentAttachment[]>([]) }),
    template: `
      <div style="padding: 24px; max-width: 760px;">
        <HandyUploader
          v-bind="args"
          v-model="files"
          style="
            --hu-primary: #7c3aed;
            --hu-primary-soft: #f5f3ff;
            --hu-radius: 16px;
            --hu-thumb-size: 96px;
            --hu-font: ui-rounded, system-ui, sans-serif;
          "
        />
      </div>
    `
  })
}
