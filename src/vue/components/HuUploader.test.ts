import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { DocumentAttachment } from '../../types'
import HuUploader from './HuUploader.vue'

const file = (name: string, size = 10, type = '') => new File(['x'.repeat(size)], name, { type })

async function chooseFiles(wrapper: ReturnType<typeof mount>, files: File[]) {
  const input = wrapper.find('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: files, configurable: true })
  await input.trigger('change')
  // FileReader in jsdom completes on a later task, not a microtask.
  await vi.waitFor(() => expect(wrapper.find('.hu-status').exists()).toBe(false))
  await flushPromises()
}

const stored = (name: string): DocumentAttachment => ({
  file: {
    name,
    format: name.split('.').pop()!,
    base64: '',
    size: 2048,
    tags: [],
    description: '',
    showDetailState: false
  }
})

describe('HuUploader', () => {
  it('renders without Vuetify', () => {
    const wrapper = mount(HuUploader)
    expect(wrapper.find('.hu-dropzone').exists()).toBe(true)
    expect(wrapper.text()).toContain('Insert File')
    expect(wrapper.html()).not.toMatch(/<v-/)
  })

  it('emits update:modelValue and add when files are chosen', async () => {
    const wrapper = mount(HuUploader, { props: { modelValue: [] } })
    await chooseFiles(wrapper, [file('report.pdf')])

    const [[value]] = wrapper.emitted('update:modelValue') as [[DocumentAttachment[]]]
    expect(value.map((a) => a.file.name)).toEqual(['report.pdf'])
    expect(wrapper.emitted('add')).toHaveLength(1)
    expect(wrapper.text()).toContain('report.pdf')
  })

  it('shows translated errors for rejected files', async () => {
    const wrapper = mount(HuUploader, { props: { accept: '.pdf', maxFileSize: 5 } })
    await chooseFiles(wrapper, [file('a.exe'), file('big.pdf', 50)])

    const alert = wrapper.find('[role="alert"]')
    expect(alert.text()).toContain('a.exe: File type is not allowed')
    expect(alert.text()).toContain('big.pdf: Max file Size is 0.0 KB')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('removes a file and emits the removed attachment', async () => {
    const files = [stored('a.pdf'), stored('b.pdf')]
    const wrapper = mount(HuUploader, { props: { modelValue: files } })

    await wrapper.find('button[aria-label="Delete a.pdf"]').trigger('click')

    expect(wrapper.emitted('remove')?.[0]).toEqual([files[0], 0])
    const [[value]] = wrapper.emitted('update:modelValue') as [[DocumentAttachment[]]]
    expect(value.map((a) => a.file.name)).toEqual(['b.pdf'])
  })

  it('disables the dropzone when the list is full', () => {
    const wrapper = mount(HuUploader, {
      props: { modelValue: [stored('a.pdf')], maxFileCount: 1 }
    })
    expect(wrapper.find('input[type="file"]').attributes('disabled')).toBeDefined()
  })

  it('renders a table layout and switches to RTL for Persian', () => {
    const wrapper = mount(HuUploader, {
      props: { modelValue: [stored('a.pdf')], layout: 'table', lang: 'fa' }
    })
    expect(wrapper.find('table.hu-table').exists()).toBe(true)
    expect(wrapper.attributes('dir')).toBe('rtl')
    expect(wrapper.text()).toContain('2.0')
  })

  it('lets a slot replace each item', () => {
    const wrapper = mount(HuUploader, {
      props: { modelValue: [stored('a.pdf')] },
      slots: { item: '<template #item="{ attachment }"><b class="custom">{{ attachment.file.name }}</b></template>' }
    })
    expect(wrapper.find('b.custom').text()).toBe('a.pdf')
  })
})
