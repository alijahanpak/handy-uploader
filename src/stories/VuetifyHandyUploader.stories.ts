import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import HandyUploader from '../components/handyUploader.vue'
import type { DocumentAttachment } from '../types'
import { argTypes, defaultArgs, stories } from './shared/uploaderStories'

const meta: Meta<typeof HandyUploader> = {
  title: 'Vue + Vuetify/HandyUploader',
  component: HandyUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**The Vuetify version**, for apps that already use Vuetify 3. It has the same props and events as the [framework-free version](?path=/docs/vue-any-css-handyuploader--docs), so you can switch between them by changing the import.

\`\`\`ts
import { HandyUploader } from 'handy-uploader/vuetify'
// needs: app.use(createVuetify()), 'vuetify/styles' and '@mdi/font'
\`\`\`

The stories match the framework-free ones one to one, so you can compare them. Upgrading from 2.x? The only change is the import path; see [Upgrading from 2.x](?path=/docs/guide-upgrading-from-2-x--docs).`
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
