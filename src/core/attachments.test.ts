import { describe, expect, it, vi } from 'vitest'
import {
  base64ByteLength,
  filterByAccept,
  precheckFiles,
  formatBytes,
  matchesAccept,
  joinFileName,
  prepareAttachments,
  readFiles,
  splitFileName
} from './attachments'
import type { DocumentAttachment } from '../types'

const toBase64 = (text: string) => btoa(text)

function staged(overrides: Partial<DocumentAttachment['file']> = {}): DocumentAttachment {
  return {
    file: {
      name: 'report',
      format: 'pdf',
      base64: toBase64('hello'),
      size: 5,
      tags: [],
      description: null,
      showDetailState: false,
      ...overrides
    }
  }
}

const limits = { currentCount: 0, maxFileCount: 10, maxFileSize: 5242880 }

describe('readFiles', () => {
  it('splits name and extension and strips the data-URL prefix', async () => {
    const [result] = await readFiles([
      new File(['hello'], 'report.pdf', { type: 'application/pdf' })
    ])
    expect(result.file).toEqual({
      name: 'report',
      format: 'pdf',
      base64: toBase64('hello'),
      size: 5,
      tags: [],
      description: null,
      showDetailState: false
    })
  })

  it('keeps every dot but the last in the name', async () => {
    const [result] = await readFiles([new File(['x'], 'my.report.final.pdf')])
    expect(result.file.name).toBe('my.report.final')
    expect(result.file.format).toBe('pdf')
  })

  it('handles files without an extension', async () => {
    const [result] = await readFiles([new File(['x'], 'README')])
    expect(result.file).toMatchObject({ name: 'README', format: '' })
  })

  it('reads every file in order', async () => {
    const result = await readFiles([new File(['a'], 'a.txt'), new File(['bb'], 'b.png')])
    expect(result.map((r) => r.file.format)).toEqual(['txt', 'png'])
  })
})

describe('prepareAttachments', () => {
  it('produces the stored attachment shape', async () => {
    const { accepted, errors } = await prepareAttachments(
      [staged({ tags: ['a'], description: 'desc' })],
      limits
    )
    expect(errors).toEqual([])
    expect(accepted).toEqual([
      {
        file: {
          base64: toBase64('hello'),
          size: 5,
          name: 'report.pdf',
          tags: ['a'],
          description: 'desc',
          showDetailState: false,
          format: 'pdf'
        }
      }
    ])
  })

  it('defaults a missing description to an empty string', async () => {
    const { accepted } = await prepareAttachments([staged()], limits)
    expect(accepted[0].file.description).toBe('')
  })

  it('strips whitespace from base64', async () => {
    const { accepted } = await prepareAttachments([staged({ base64: 'aGVs\nbG8=' })], limits)
    expect(accepted[0].file.base64).toBe('aGVsbG8=')
  })

  it('stops at the file-count limit, counting files already in the list', async () => {
    const { accepted, errors } = await prepareAttachments([staged(), staged(), staged()], {
      ...limits,
      currentCount: 8
    })
    expect(accepted).toHaveLength(2)
    expect(errors).toEqual([{ code: 'maxFileCount', fileName: 'report.pdf', limit: 10 }])
  })

  it('skips files over maxFileSize (bytes) and keeps going', async () => {
    const { accepted, errors } = await prepareAttachments(
      [staged({ name: 'big', size: 2001 }), staged({ name: 'ok', size: 2000 })],
      { ...limits, maxFileSize: 2000 }
    )
    expect(accepted.map((a) => a.file.name)).toEqual(['ok.pdf'])
    expect(errors).toEqual([{ code: 'maxFileSize', fileName: 'big.pdf', limit: 2000 }])
  })

  it('compresses images with the configured quality and stores them as jpg', async () => {
    const original = toBase64('x'.repeat(300))
    const small = toBase64('y'.repeat(30))
    const compress = vi.fn().mockResolvedValue(`data:image/jpeg;base64,${small}`)
    const { accepted } = await prepareAttachments(
      [staged({ name: 'photo', format: 'png', base64: original, size: 300 })],
      { ...limits, imageCompressor: true, imageCompressLevel: 0.5 },
      compress
    )
    expect(compress).toHaveBeenCalledWith(`data:image/png;base64,${original}`, 0.5)
    expect(accepted[0].file).toMatchObject({
      name: 'photo.jpg',
      format: 'jpg',
      base64: small,
      size: 30
    })
  })

  it('keeps the original when compression does not make it smaller', async () => {
    const compress = vi.fn().mockResolvedValue(`data:image/jpeg;base64,${toBase64('much bigger')}`)
    const { accepted } = await prepareAttachments(
      [staged({ name: 'icon', format: 'png' })],
      { ...limits, imageCompressor: true },
      compress
    )
    expect(accepted[0].file).toMatchObject({ name: 'icon.png', format: 'png', size: 5 })
  })

  it('does not compress non-images or when the option is off', async () => {
    const compress = vi.fn()
    await prepareAttachments(
      [staged({ format: 'pdf' })],
      { ...limits, imageCompressor: true },
      compress
    )
    await prepareAttachments([staged({ format: 'jpg' })], limits, compress)
    expect(compress).not.toHaveBeenCalled()
  })

  it('keeps the original when compression fails', async () => {
    const compress = vi.fn().mockRejectedValue(new Error('bad image'))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { accepted, errors } = await prepareAttachments(
      [staged({ name: 'photo', format: 'jpeg' }), staged({ name: 'fine' })],
      { ...limits, imageCompressor: true },
      compress
    )
    expect(accepted.map((a) => a.file.name)).toEqual(['photo.jpeg', 'fine.pdf'])
    expect(accepted[0].file.base64).toBe(toBase64('hello'))
    expect(errors).toEqual([])
  })

  it('never replaces a file with an empty compression result ("data:,")', async () => {
    const compress = vi.fn().mockResolvedValue('data:,')
    const { accepted } = await prepareAttachments(
      [staged({ name: 'huge', format: 'png' })],
      { ...limits, imageCompressor: true },
      compress
    )
    expect(accepted[0].file).toMatchObject({
      name: 'huge.png',
      format: 'png',
      size: 5,
      base64: toBase64('hello')
    })
  })
})

describe('precheckFiles', () => {
  const f = (name: string, size: number) => new File(['x'.repeat(size)], name)

  it('applies size and count limits without reading files', () => {
    const result = precheckFiles([f('big.mov', 50), f('a.txt', 1), f('b.txt', 1), f('c.txt', 1)], {
      currentCount: 1,
      maxFileCount: 3,
      maxFileSize: 10
    })
    expect(result.accepted.map((x) => x.name)).toEqual(['a.txt', 'b.txt'])
    expect(result.errors).toEqual([
      { code: 'maxFileSize', fileName: 'big.mov', limit: 10 },
      { code: 'maxFileCount', fileName: 'c.txt', limit: 3 }
    ])
  })
})

describe('file name helpers', () => {
  it.each([
    ['report.pdf', 'report', 'pdf'],
    ['my.report.pdf', 'my.report', 'pdf'],
    ['README', 'README', ''],
    ['.env', '.env', '']
  ])('splits %s', (file, name, format) => {
    expect(splitFileName(file)).toEqual({ name, format })
    expect(joinFileName(name, format)).toBe(file)
  })

  it('computes decoded base64 length', () => {
    for (const text of ['', 'a', 'ab', 'abc', 'abcd']) {
      expect(base64ByteLength(btoa(text))).toBe(text.length)
    }
  })
})

describe('matchesAccept', () => {
  const pdf = { name: 'a.PDF', type: 'application/pdf' }
  const png = { name: 'b.png', type: 'image/png' }

  it.each([
    ['', pdf, true],
    ['*', png, true],
    ['.pdf', pdf, true],
    ['.pdf', png, false],
    ['image/*', png, true],
    ['image/*', pdf, false],
    ['application/pdf, .docx', pdf, true],
    ['.jpg,.jpeg', png, false]
  ])('accept=%j', (accept, file, expected) => {
    expect(matchesAccept(file, accept)).toBe(expected)
  })

  it('filterByAccept reports rejected files', () => {
    const files = [new File([''], 'a.pdf'), new File([''], 'b.exe')]
    const result = filterByAccept(files, '.pdf')
    expect(result.accepted.map((f) => f.name)).toEqual(['a.pdf'])
    expect(result.errors).toEqual([{ code: 'fileType', fileName: 'b.exe' }])
  })
})

describe('formatBytes', () => {
  it('formats KB and MB with custom units', () => {
    expect(formatBytes(1536)).toBe('1.5 KB')
    expect(formatBytes(5 * 1024 * 1024, { kb: 'کیلوبایت', mb: 'مگابایت' })).toBe('5.0 مگابایت')
  })
})
