import type { Meta, StoryObj } from '@storybook/vue3'
import { defineComponent, h, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import '../element'
import type { HandyUploaderElement } from '../element'
import type { DocumentAttachment } from '../types'
import { argTypes as vueArgTypes, defaultArgs, stories } from './shared/uploaderStories'

// The args of the Vue stories, with the file list renamed to the element's `files` property.
type ElementArgs = Record<string, unknown> & { files?: DocumentAttachment[] }

function toElementArgs(args: Record<string, unknown>): ElementArgs {
  const { documentAttachment, ...rest } = args
  return documentAttachment === undefined
    ? rest
    : { ...rest, files: documentAttachment as DocumentAttachment[] }
}

const { documentAttachment: filesArgType, ...otherArgTypes } = vueArgTypes
const argTypes = {
  files: {
    ...filesArgType,
    description:
      'The files, as a JS property: `el.files = [...]`. Read it back the same way; `hu-change` has the new list in `detail.files`.'
  },
  ...otherArgTypes,
  tags: {
    ...otherArgTypes.tags,
    description: 'The tags users can choose from. As an attribute: `tags="invoice, contract"`.'
  }
}

const EVENTS = ['hu-change', 'hu-add', 'hu-remove', 'hu-error'] as const

const kebab = (name: string) => name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

function summarise(event: CustomEvent): string {
  const d = event.detail ?? {}
  const names = (list: DocumentAttachment[] = []) => list.map((a) => a.file.name).join(', ')
  switch (event.type) {
    case 'hu-change':
      return `${d.files.length} files${d.files.length ? `: ${names(d.files)}` : ''}`
    case 'hu-add':
      return `added ${names(d.added)}`
    case 'hu-remove':
      return `removed ${d.attachment.file.name} (index ${d.index})`
    case 'hu-error':
      return d.errors
        .map(
          (e: { code: string; fileName?: string }) =>
            `${e.code}${e.fileName ? ` (${e.fileName})` : ''}`
        )
        .join(', ')
    default:
      return ''
  }
}

/**
 * Renders a real <handy-uploader> the way a non-Vue app would: created with
 * document.createElement, configured through attributes (and the `files` property), and
 * listened to with addEventListener. The events are shown in a log under it.
 */
const ElementDemo = defineComponent({
  name: 'HandyUploaderElementDemo',
  props: { args: { type: Object, required: true } },
  setup(props) {
    const host = ref<HTMLElement | null>(null)
    const log = reactive<{ type: string; text: string }[]>([])
    let el: HandyUploaderElement | null = null
    let filesSet: unknown

    function apply(args: ElementArgs) {
      if (!el) return
      for (const [name, value] of Object.entries(args)) {
        if (name === 'files') continue
        const attr = kebab(name)
        if (value === undefined || value === null) el.removeAttribute(attr)
        else if (name === 'customLang') el.customLang = value as HandyUploaderElement['customLang']
        else if (Array.isArray(value)) el.setAttribute(attr, value.join(', '))
        else el.setAttribute(attr, String(value))
      }
      // Only when the story's list itself changes, so files added in the UI are kept.
      if (args.files !== filesSet) {
        filesSet = args.files
        el.files = [...(args.files ?? [])]
      }
    }

    const onEvent = (event: Event) => {
      log.unshift({ type: event.type, text: summarise(event as CustomEvent) })
    }

    onMounted(() => {
      el = document.createElement('handy-uploader')
      for (const type of EVENTS) el.addEventListener(type, onEvent)
      apply(props.args as ElementArgs)
      host.value?.appendChild(el)
    })
    watch(() => ({ ...(props.args as ElementArgs) }), apply)
    onBeforeUnmount(() => {
      for (const type of EVENTS) el?.removeEventListener(type, onEvent)
      el?.remove()
    })

    return () =>
      h('div', { style: 'width: 100%; padding: 20px; min-height: 560px;' }, [
        h('div', { ref: host }),
        h(
          'section',
          { class: 'hu-event-log', style: 'margin-top: 24px; font: 13px/1.5 monospace' },
          [
            h('strong', 'Events'),
            h(
              'ol',
              {
                'aria-label': 'Events',
                reversed: true,
                style: 'margin: 4px 0; padding-left: 28px'
              },
              log.map((entry, i) =>
                h(
                  'li',
                  { key: log.length - i, 'data-event': entry.type },
                  `${entry.type}: ${entry.text}`
                )
              )
            )
          ]
        )
      ])
  }
})

const meta: Meta = {
  title: 'Web Component/<handy-uploader>',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**\`<handy-uploader>\`**, a Web Component for any framework (React, Svelte, Angular, …) or plain HTML. It is the [framework-free Vue component](?path=/docs/vue-any-css-handyuploader--docs) inside a custom element, with Vue bundled and the default theme injected, so it has the same features and \`--hu-*\` CSS variables.

\`\`\`ts
import 'handy-uploader/element' // registers <handy-uploader>
\`\`\`

\`\`\`html
<handy-uploader
  file-uploader-type="thumbnail"
  max-file-count="5"
  change-file-name
  add-file-tag
  tags="invoice, contract, photo"
></handy-uploader>
<script type="module">
  const el = document.querySelector('handy-uploader')
  el.files = []                       // the file list is a JS property
  el.addEventListener('hu-change', (e) => console.log(e.detail.files))
</script>
\`\`\`

Every option is a kebab-case attribute or a camelCase JS property. Events: \`hu-change\` (\`detail.files\`), \`hu-add\` (\`detail.added\`), \`hu-remove\` (\`detail.attachment\`, \`detail.index\`) and \`hu-error\` (\`detail.errors\`). Methods: \`addFiles(files)\`, \`removeAt(index)\` and \`openInsert()\`. The stories below set the options as attributes and log the events under the uploader.`
      }
    }
  },
  argTypes: argTypes as Meta['argTypes'],
  args: toElementArgs(defaultArgs),
  render: (args) => ({
    components: { ElementDemo },
    setup: () => ({ args }),
    template: '<ElementDemo :args="args" />'
  })
}

export default meta
type Story = StoryObj<typeof meta>

const story = (name: keyof typeof stories): Story => ({
  args: toElementArgs(stories[name].args),
  parameters: stories[name].parameters
})

export const ThumbnailView = story('ThumbnailView')
export const Playground = story('Playground')
export const SimpleView = story('SimpleView')
export const TableView = story('TableView')
export const WithImageCompression = story('WithImageCompression')
export const OutlinedCards = story('OutlinedCards')
export const RaisedCards = story('RaisedCards')
export const RestrictedFileTypes = story('RestrictedFileTypes')
export const ReadOnlyMode = story('ReadOnlyMode')
export const MinimalFeatures = story('MinimalFeatures')
export const RTLSupport = story('RTLSupport')
export const FrenchLanguage = story('FrenchLanguage')
