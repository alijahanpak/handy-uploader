import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { reactive } from 'vue'
import type { DocumentAttachment } from '../../types'
import HandyUploader from './HandyUploader.vue'

const file = (name: string, size = 10, type = '') => new File(['x'.repeat(size)], name, { type })

const stored = (name: string, extra: Partial<DocumentAttachment['file']> = {}): DocumentAttachment => ({
  file: {
    name,
    format: name.split('.').pop()!,
    base64: '',
    size: 2048,
    tags: [],
    description: '',
    showDetailState: false,
    ...extra
  }
})

async function settle(wrapper: VueWrapper) {
  await vi.waitFor(() => expect(wrapper.find('.hu-status').exists()).toBe(false))
  await flushPromises()
}

/** Opens the insert dialog and picks files through its file input. */
async function pickFiles(wrapper: VueWrapper, files: File[]) {
  await wrapper.find('.hu-toolbar button').trigger('click')
  const input = wrapper.find('dialog input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: files, configurable: true })
  await input.trigger('change')
  await settle(wrapper)
}

const addButton = (wrapper: VueWrapper) =>
  wrapper.findAll('dialog button').find((b) => b.text() === 'Add')!

describe('HandyUploader (no Vuetify)', () => {
  it('renders the insert button without Vuetify', () => {
    const wrapper = mount(HandyUploader, { props: { documentAttachment: [] } })
    expect(wrapper.find('.hu-toolbar button').text()).toContain('Insert File')
    expect(wrapper.html()).not.toMatch(/<v-/)
  })

  it('adds picked files to the array in place and emits both update events', async () => {
    const list = reactive<DocumentAttachment[]>([])
    const wrapper = mount(HandyUploader, { props: { documentAttachment: list } })

    await pickFiles(wrapper, [file('report.pdf')])
    expect(wrapper.find('.hu-staged').text()).toContain('report.pdf')
    expect(list).toHaveLength(0) // not added until "Add"

    await addButton(wrapper).trigger('click')
    await settle(wrapper)

    expect(list.map((a) => a.file.name)).toEqual(['report.pdf'])
    expect(wrapper.emitted('updateDocumentAttachment')?.[0]?.[0]).toBe(list)
    expect(wrapper.emitted('update:documentAttachment')).toHaveLength(1)
    expect(wrapper.emitted('add')).toHaveLength(1)
  })

  it('lets you set name, description and tags before adding', async () => {
    const list = reactive<DocumentAttachment[]>([])
    const wrapper = mount(HandyUploader, {
      props: {
        documentAttachment: list,
        changeFileName: true,
        addFileDescription: true,
        addFileTag: true,
        tags: ['invoice', 'contract']
      }
    })
    await pickFiles(wrapper, [file('scan.pdf')])

    await wrapper.find('.hu-staged input[type="text"]').setValue('march-invoice')
    await wrapper.find('.hu-staged textarea').setValue('Paid')
    await wrapper.find('.hu-staged input[value="invoice"]').setValue(true)
    await addButton(wrapper).trigger('click')
    await settle(wrapper)

    expect(list[0].file).toMatchObject({
      name: 'march-invoice.pdf',
      description: 'Paid',
      tags: ['invoice']
    })
  })

  it('shows translated errors for rejected files', async () => {
    const wrapper = mount(HandyUploader, {
      props: { documentAttachment: [], fileAccept: '.pdf', maxFileSize: 5 }
    })
    await pickFiles(wrapper, [file('a.exe'), file('big.pdf', 50)])

    const alert = wrapper.find('dialog [role="alert"]')
    expect(alert.text()).toContain('a.exe: File type is not allowed')
    expect(alert.text()).toContain('big.pdf: Max file Size is 0.0 KB')
    expect(wrapper.find('.hu-staged').exists()).toBe(false)
  })

  it('asks for confirmation before deleting', async () => {
    const list = reactive([stored('a.pdf'), stored('b.pdf')])
    const wrapper = mount(HandyUploader, { props: { documentAttachment: list } })

    await wrapper.find('button[aria-label="Delete a.pdf"]').trigger('click')
    expect(list).toHaveLength(2)
    expect(wrapper.text()).toContain('Are you sure you want to delete the file?')

    const confirm = wrapper.findAll('dialog button').filter((b) => b.text() === 'Delete').at(-1)!
    await confirm.trigger('click')

    expect(list.map((a) => a.file.name)).toEqual(['b.pdf'])
    expect(wrapper.emitted('remove')?.[0]?.[1]).toBe(0)
  })

  it('edits description and tags of an existing file', async () => {
    const list = reactive([stored('a.pdf')])
    const wrapper = mount(HandyUploader, {
      props: { documentAttachment: list, addFileDescription: true, addFileTag: true, tags: ['x', 'y'] }
    })

    await wrapper.find('button[aria-label="Edit a.pdf"]').trigger('click')
    await wrapper.find('.hu-edit textarea').setValue('Signed copy')
    await wrapper.find('.hu-edit input[value="y"]').setValue(true)
    const save = wrapper.findAll('dialog button').filter((b) => b.text() === 'Edit').at(-1)!
    await save.trigger('click')

    expect(list[0].file).toMatchObject({ name: 'a.pdf', description: 'Signed copy', tags: ['y'] })
  })

  it('shows tags and description in the expandable details', async () => {
    const wrapper = mount(HandyUploader, {
      props: { documentAttachment: [stored('a.pdf', { tags: ['contract'], description: 'v2' })] }
    })
    expect(wrapper.find('.hu-card__details').exists()).toBe(false)
    await wrapper.find('.hu-details-toggle').trigger('click')
    expect(wrapper.find('.hu-card__details').text()).toContain('contract')
    expect(wrapper.find('.hu-card__details').text()).toContain('v2')
  })

  it('honours the permissions (read-only mode)', () => {
    const wrapper = mount(HandyUploader, {
      props: {
        documentAttachment: [stored('a.pdf')],
        insertPermission: false,
        editPermission: false,
        deletePermission: false
      }
    })
    expect(wrapper.find('.hu-toolbar').exists()).toBe(false)
    expect(wrapper.find('.hu-icon-button--danger').exists()).toBe(false)
    expect(wrapper.find('.hu-icon-button--edit').exists()).toBe(false)
  })

  it('renders the three views and card styles like the Vuetify version', async () => {
    const wrapper = mount(HandyUploader, {
      props: { documentAttachment: [stored('a.pdf')], cardType: 'outlined', cols: 4 }
    })
    expect(wrapper.find('.hu-files--thumbnail').attributes('style')).toContain('--hu-columns: 3')
    expect(wrapper.find('.hu-card--outlined').exists()).toBe(true)

    await wrapper.setProps({ fileUploaderType: 'simple' })
    expect(wrapper.find('.hu-card--simple').exists()).toBe(true)

    await wrapper.setProps({ fileUploaderType: 'table' })
    expect(wrapper.find('table.hu-table').exists()).toBe(true)
  })

  it('shows the count badge, switches to RTL and echoes prop changes', async () => {
    const wrapper = mount(HandyUploader, {
      props: { documentAttachment: [stored('a.pdf')], lang: 'fa', maxFileCount: 1 }
    })
    expect(wrapper.find('.hu-count').attributes('data-hu-full')).toBe('true')
    expect(wrapper.attributes('dir')).toBe('rtl')

    await wrapper.setProps({ cardType: 'raised' })
    expect(wrapper.emitted('updateCardType')?.[0]).toEqual(['raised'])
  })
})
