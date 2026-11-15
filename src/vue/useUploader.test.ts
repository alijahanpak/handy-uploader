import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { DocumentAttachment } from '../types'
import { useUploader } from './useUploader'

const file = (name: string, size = 10, type = '') => new File(['x'.repeat(size)], name, { type })

describe('useUploader', () => {
  it('appends accepted files without mutating the original array', async () => {
    const list = ref<DocumentAttachment[]>([])
    const original = list.value
    const { add } = useUploader(list)

    const added = await add([file('a.pdf'), file('b.txt')])

    expect(added).toHaveLength(2)
    expect(list.value.map((a) => a.file.name)).toEqual(['a.pdf', 'b.txt'])
    expect(original).toEqual([])
  })

  it('reports type, size and count errors together', async () => {
    const list = ref<DocumentAttachment[]>([])
    const { add, errors } = useUploader(list, {
      accept: '.pdf',
      maxFileSize: 100,
      maxFileCount: 1
    })

    await add([file('virus.exe'), file('big.pdf', 500), file('one.pdf'), file('two.pdf')])

    expect(list.value.map((a) => a.file.name)).toEqual(['one.pdf'])
    expect(errors.value.map((e) => e.code)).toEqual(['fileType', 'maxFileSize', 'maxFileCount'])
  })

  it('add() never reads files beyond the limit, even when calls overlap', async () => {
    const list = ref<DocumentAttachment[]>([])
    const { add, errors } = useUploader(list, { maxFileCount: 2 })
    const first = add([file('1.txt'), file('2.txt')])
    const second = add([file('3.txt')])
    await Promise.all([first, second])
    expect(list.value).toHaveLength(2)
    expect(errors.value.map((e) => e.code)).toEqual(['maxFileCount'])
  })

  it('runs overlapping adds in order so the count limit holds', async () => {
    const list = ref<DocumentAttachment[]>([])
    const { add } = useUploader(list, { maxFileCount: 2 })

    await Promise.all([add([file('1.txt')]), add([file('2.txt')]), add([file('3.txt')])])

    expect(list.value.map((a) => a.file.name)).toEqual(['1.txt', '2.txt'])
  })

  it('reads options lazily from a getter', async () => {
    const list = ref<DocumentAttachment[]>([])
    const accept = ref('.pdf')
    const { add } = useUploader(list, () => ({ accept: accept.value }))

    await add([file('a.png')])
    accept.value = 'image/*'
    await add([file('a.png', 10, 'image/png')])

    expect(list.value.map((a) => a.file.name)).toEqual(['a.png'])
  })

  it('removes, updates and clears', async () => {
    const list = ref<DocumentAttachment[]>([])
    const { add, remove, update, clear, canAddMore } = useUploader(list, { maxFileCount: 2 })
    await add([file('a.txt'), file('b.txt')])
    expect(canAddMore.value).toBe(false)

    update(1, { description: 'second', tags: ['x'] })
    expect(list.value[1].file).toMatchObject({ name: 'b.txt', description: 'second', tags: ['x'] })

    remove(0)
    expect(list.value.map((a) => a.file.name)).toEqual(['b.txt'])
    expect(canAddMore.value).toBe(true)

    clear()
    expect(list.value).toEqual([])
  })
})
