// Shared Storybook setup for both flavours of HandyUploader, so their controls,
// defaults and stories stay identical and can be compared side by side.
import type { DocumentAttachment } from '../../types'
import { sampleFiles } from './sampleFiles'

const cat = (category: string, defaultValue?: string) => ({
  table: { category, ...(defaultValue !== undefined ? { defaultValue: { summary: defaultValue } } : {}) }
})

export const argTypes = {
  documentAttachment: {
    description:
      'The files. Use `v-model:document-attachment`, or pass an array: the component updates it in place and emits `updateDocumentAttachment`.',
    control: { type: 'object' },
    ...cat('Files', '[]')
  },
  fileUploaderType: {
    description: 'Layout: `thumbnail` (preview cards), `simple` (compact cards) or `table`.',
    control: { type: 'inline-radio' },
    options: ['thumbnail', 'simple', 'table'],
    ...cat('Layout', "'thumbnail'")
  },
  cols: {
    description: 'Thumbnail view: card width out of 12 columns (3 = four per row, 4 = three per row).',
    control: { type: 'range', min: 1, max: 12, step: 1 },
    ...cat('Layout', '3')
  },
  cardType: {
    description: 'Card style for the thumbnail and simple views.',
    control: { type: 'inline-radio' },
    options: ['default', 'outlined', 'raised', 'shaped', 'tile'],
    ...cat('Layout', "'default'")
  },
  thumb: {
    description: 'Show image previews and video thumbnails. When off, file-type icons are shown.',
    control: { type: 'boolean' },
    ...cat('Layout', 'true')
  },
  tableThumbColumn: {
    description: 'Table view: show the preview column.',
    control: { type: 'boolean' },
    ...cat('Layout', 'true')
  },
  tableFixedHeader: {
    description: 'Table view: keep the header visible while scrolling.',
    control: { type: 'boolean' },
    ...cat('Layout', 'true')
  },
  tableHeight: {
    description: 'Table view: height in pixels when the header is fixed.',
    control: { type: 'number' },
    ...cat('Layout', '400')
  },
  maxFileSize: {
    description: 'Maximum size per file, **in bytes** (5242880 = 5 MB). Larger files are rejected with a message.',
    control: { type: 'number' },
    ...cat('Limits & validation', '5242880')
  },
  maxFileCount: {
    description: 'Maximum number of files. The Insert button is disabled and its badge turns red at the limit.',
    control: { type: 'number' },
    ...cat('Limits & validation', '10')
  },
  fileAccept: {
    description:
      'Accepted types, in the same format as the HTML `accept` attribute (e.g. `image/*,.pdf`). Empty or `*` accepts everything.',
    control: { type: 'text' },
    ...cat('Limits & validation', "''")
  },
  imageCompressor: {
    description: 'Compress JPEG, PNG and WebP images. They are re-encoded as JPEG and kept only when smaller.',
    control: { type: 'boolean' },
    ...cat('Images', 'false')
  },
  imageCompressLevel: {
    description: 'JPEG quality for compression, from 0 to 1.',
    control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
    ...cat('Images', '0.8')
  },
  changeFileName: {
    description: 'Let users rename files, when adding and when editing.',
    control: { type: 'boolean' },
    ...cat('Editing', 'false')
  },
  addFileDescription: {
    description: 'Let users add a description. It is shown under the card’s details arrow.',
    control: { type: 'boolean' },
    ...cat('Editing', 'false')
  },
  addFileTag: {
    description: 'Let users pick tags from `tags`.',
    control: { type: 'boolean' },
    ...cat('Editing', 'false')
  },
  tags: {
    description: 'The tags users can choose from.',
    control: { type: 'object' },
    ...cat('Editing', '[]')
  },
  insertPermission: {
    description: 'Show the Insert button.',
    control: { type: 'boolean' },
    ...cat('Permissions', 'true')
  },
  editPermission: {
    description: 'Show the edit (pencil) button. Hidden anyway when nothing is editable.',
    control: { type: 'boolean' },
    ...cat('Permissions', 'true')
  },
  deletePermission: {
    description: 'Show the delete button. Deleting always asks for confirmation.',
    control: { type: 'boolean' },
    ...cat('Permissions', 'true')
  },
  badgeCounter: {
    description: 'Show the number of files on the Insert button.',
    control: { type: 'boolean' },
    ...cat('Appearance', 'true')
  },
  btnColor: {
    description:
      'Button colour: a Vuetify colour name (`primary`, `info`, `success`, `warning`, `error`…). Without Vuetify, any CSS colour also works.',
    control: { type: 'text' },
    ...cat('Appearance', "'info'")
  },
  lang: {
    description: 'Interface language: `en`, `fa`, `fr`, `ch`, `ar`, or a key you add with `customLang`.',
    control: { type: 'inline-radio' },
    options: ['en', 'fa', 'fr', 'ch', 'ar'],
    ...cat('Language', "'en'")
  },
  rtlSupport: {
    description:
      'Right-to-left layout. Without Vuetify it is also on automatically for `fa` and `ar`; with Vuetify, use Vuetify’s own RTL setting.',
    control: { type: 'boolean' },
    ...cat('Language', 'false')
  },
  customLang: {
    description: 'Your own translations. See the README section “Internationalization”.',
    control: false,
    ...cat('Language', 'null')
  }
}

/** Args shared by every story: an empty list with all editing features on. */
export const defaultArgs = {
  documentAttachment: [] as DocumentAttachment[],
  fileUploaderType: 'thumbnail',
  lang: 'en',
  maxFileSize: 5242880,
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
  tags: ['invoice', 'contract', 'photo', 'draft', 'proposal', 'data'],
  editPermission: true,
  deletePermission: true,
  insertPermission: true
}

const note = (story: string) => ({ docs: { description: { story } } })

/** Per-story args and an explanation of what the story shows and what to try. */
export const stories = {
  Playground: {
    args: {},
    parameters: note(
      'Starts empty with every editing feature on. Click **Insert File**, pick or drop files, give them a name, description and tags, then **Add**. Change anything in the **Controls** panel below.'
    )
  },
  ThumbnailView: {
    args: { documentAttachment: sampleFiles, fileUploaderType: 'thumbnail', cols: 3 },
    parameters: note(
      '`fileUploaderType="thumbnail"`: large previews. Images show the picture, videos get an automatic thumbnail with a play icon, and other files show a file-type icon. The arrow opens the tags and description.'
    )
  },
  SimpleView: {
    args: { documentAttachment: sampleFiles, fileUploaderType: 'simple' },
    parameters: note('`fileUploaderType="simple"`: compact cards with the name and size on the left and a small preview on the right.')
  },
  TableView: {
    args: {
      documentAttachment: sampleFiles,
      fileUploaderType: 'table',
      tableFixedHeader: true,
      tableHeight: 300
    },
    parameters: note(
      '`fileUploaderType="table"`: one row per file. The size chip is green below 1 MB, orange below 5 MB and red above. `tableFixedHeader` keeps the header visible while scrolling.'
    )
  },
  WithImageCompression: {
    args: {
      documentAttachment: sampleFiles,
      imageCompressor: true,
      imageCompressLevel: 0.6,
      fileAccept: 'image/*'
    },
    parameters: note(
      '`imageCompressor` with quality 0.6, images only. Add a large photo: it is saved as a `.jpg` and its size chip shows the smaller size. Small images that would grow are kept as they are.'
    )
  },
  OutlinedCards: {
    args: { documentAttachment: sampleFiles, cardType: 'outlined' },
    parameters: note('`cardType="outlined"`: a border instead of a shadow. The other styles are `raised`, `shaped` and `tile`.')
  },
  RaisedCards: {
    args: { documentAttachment: sampleFiles, cardType: 'raised' },
    parameters: note('`cardType="raised"`: a stronger shadow.')
  },
  RestrictedFileTypes: {
    args: { fileAccept: '.pdf,.doc,.docx,.jpg,.png', maxFileSize: 2000000, maxFileCount: 5 },
    parameters: note(
      'Only PDF, Word, JPG and PNG, up to 2 MB, at most 5 files. Try adding another type or a larger file: it is rejected with a message, and the other files are still added.'
    )
  },
  ReadOnlyMode: {
    args: {
      documentAttachment: sampleFiles,
      editPermission: false,
      deletePermission: false,
      insertPermission: false
    },
    parameters: note('All permissions off: no Insert button and no edit or delete buttons. Useful for showing files that must not change.')
  },
  MinimalFeatures: {
    args: {
      documentAttachment: sampleFiles,
      badgeCounter: false,
      changeFileName: false,
      addFileDescription: false,
      addFileTag: false,
      thumb: false
    },
    parameters: note(
      'Editing features and previews off: files are added straight from the dialog, and every card shows a file-type icon.'
    )
  },
  RTLSupport: {
    args: { documentAttachment: sampleFiles, lang: 'fa', rtlSupport: true },
    parameters: note('Persian (`lang="fa"`) with a right-to-left layout.')
  },
  FrenchLanguage: {
    args: { documentAttachment: sampleFiles, lang: 'fr', fileUploaderType: 'table' },
    parameters: note('French (`lang="fr"`) in the table view. All texts, including errors and dialogs, are translated.')
  }
}
