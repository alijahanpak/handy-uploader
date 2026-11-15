import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import HandyUploader from '../vue/components/HandyUploader.vue'
import '../vue/theme.css'
import type { DocumentAttachment } from '../types'
import { argTypes, defaultArgs, stories } from './shared/uploaderStories'
import { sampleFiles } from './shared/sampleFiles'

const meta: Meta<typeof HandyUploader> = {
  title: 'Vue (any CSS)/HandyUploader',
  component: HandyUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**The framework-free uploader.** Plain HTML and CSS, so it works in any Vue 3 app with any CSS framework, or none. It has the same props and events as the [Vuetify version](?path=/docs/vue-vuetify-handyuploader--docs).

\`\`\`ts
import { HandyUploader } from 'handy-uploader'
import 'handy-uploader/style.css'
\`\`\`

\`\`\`vue
<HandyUploader
  v-model:document-attachment="files"
  file-uploader-type="thumbnail"
  change-file-name
  add-file-tag
  :tags="['invoice', 'photo']"
/>
\`\`\`

Each story below shows one feature. Use **Controls** to change the props live. The guide pages explain [styling](?path=/docs/guide-styling-theming--docs) and [building your own UI](?path=/docs/guide-build-your-own-ui--docs).`
      }
    }
  },
  argTypes: argTypes as Meta<typeof HandyUploader>['argTypes'],
  args: defaultArgs as Meta<typeof HandyUploader>['args'],
  render: (args) => ({
    components: { HandyUploader },
    setup() {
      const files = ref<DocumentAttachment[]>(args.documentAttachment || [])
      return { args, files }
    },
    template: `
      <div style="width: 100%; padding: 20px; min-height: 560px;">
        <HandyUploader v-bind="args" v-model:document-attachment="files" />
      </div>
    `
  })
}

export default meta
type Story = StoryObj<typeof meta>

export const ThumbnailView: Story = stories.ThumbnailView as Story
export const Playground: Story = stories.Playground as Story
export const SimpleView: Story = stories.SimpleView as Story
export const TableView: Story = stories.TableView as Story
export const WithImageCompression: Story = stories.WithImageCompression as Story
export const OutlinedCards: Story = stories.OutlinedCards as Story
export const RaisedCards: Story = stories.RaisedCards as Story
export const RestrictedFileTypes: Story = stories.RestrictedFileTypes as Story
export const ReadOnlyMode: Story = stories.ReadOnlyMode as Story
export const MinimalFeatures: Story = stories.MinimalFeatures as Story
export const RTLSupport: Story = stories.RTLSupport as Story
export const FrenchLanguage: Story = stories.FrenchLanguage as Story

export const DarkMode: Story = {
  args: { documentAttachment: sampleFiles },
  parameters: {
    docs: {
      description: {
        story:
          'Add the `hu-dark` class to the component or any parent for the built-in dark preset. *(Only in this flavour.)*'
      }
    }
  },
  render: (args) => ({
    components: { HandyUploader },
    setup: () => ({ args, files: ref<DocumentAttachment[]>(args.documentAttachment || []) }),
    template: `
      <div class="hu-dark" style="background: #0d1117; padding: 20px; min-height: 560px;">
        <HandyUploader v-bind="args" v-model:document-attachment="files" />
      </div>
    `
  })
}

export const CustomTheme: Story = {
  args: { documentAttachment: sampleFiles, cardType: 'shaped' },
  parameters: {
    docs: {
      description: {
        story:
          'Re-themed with nothing but CSS variables: `--hu-primary`, `--hu-button-bg`, `--hu-chip`, `--hu-radius` and `--hu-font`. See [Styling & Theming](?path=/docs/guide-styling-theming--docs) for the full list. *(Only in this flavour.)*'
      }
    }
  },
  render: (args) => ({
    components: { HandyUploader },
    setup: () => ({ args, files: ref<DocumentAttachment[]>(args.documentAttachment || []) }),
    template: `
      <div style="padding: 20px; min-height: 560px;">
        <HandyUploader
          v-bind="args"
          v-model:document-attachment="files"
          style="--hu-primary: #7c3aed; --hu-button-bg: #7c3aed; --hu-chip: #7c3aed; --hu-radius: 20px; --hu-font: ui-rounded, system-ui, sans-serif;"
        />
      </div>
    `
  })
}

export const CustomActions: Story = {
  args: { documentAttachment: sampleFiles, fileUploaderType: 'table' },
  parameters: {
    docs: {
      description: {
        story:
          'The `actions` slot adds your own buttons to every card or row. This one downloads the file. The `item` slot can replace a whole card. *(Only in this flavour.)*'
      },
      source: {
        code: `<HandyUploader v-model:document-attachment="files">
  <template #actions="{ attachment }">
    <a :href="'data:application/octet-stream;base64,' + attachment.file.base64" :download="attachment.file.name">
      Download
    </a>
  </template>
</HandyUploader>`
      }
    }
  },
  render: (args) => ({
    components: { HandyUploader },
    setup: () => ({ args, files: ref<DocumentAttachment[]>(args.documentAttachment || []) }),
    template: `
      <div style="padding: 20px; min-height: 400px;">
        <HandyUploader v-bind="args" v-model:document-attachment="files">
          <template #actions="{ attachment }">
            <a
              class="hu-button"
              style="padding: 4px 10px; text-decoration: none;"
              :href="'data:application/octet-stream;base64,' + attachment.file.base64"
              :download="attachment.file.name"
            >Download</a>
          </template>
        </HandyUploader>
      </div>
    `
  })
}
