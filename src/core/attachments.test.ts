import { describe, expect, it, vi } from 'vitest'
import { prepareAttachments, readFiles } from './attachments'
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
    const [result] = await readFiles([new File(['hello'], 'report.pdf', { type: 'application/pdf' })])
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

  it('keeps the legacy name handling for names with several dots', async () => {
    const [result] = await readFiles([new File(['x'], 'my.report.final.pdf')])
    expect(result.file.name).toBe('my')
    expect(result.file.format).toBe('pdf')
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
          size: '5',
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
    expect(errors).toEqual([{ code: 'maxFileCount', fileName: 'report', limit: 10 }])
  })

  it('skips oversized files and keeps going (legacy: size/1000 compared to maxFileSize)', async () => {
    const { accepted, errors } = await prepareAttachments(
      [staged({ name: 'big', size: 2001 }), staged({ name: 'ok', size: 2000 })],
      { ...limits, maxFileSize: 2 }
    )
    expect(accepted.map((a) => a.file.name)).toEqual(['ok.pdf'])
    expect(errors).toEqual([{ code: 'maxFileSize', fileName: 'big', limit: 2 }])
  })

  it('does not compress when format is an extension (legacy behaviour)', async () => {
    const compress = vi.fn()
    await prepareAttachments([staged({ format: 'png' })], { ...limits, imageCompressor: true }, compress)
    expect(compress).not.toHaveBeenCalled()
  })

  it('compresses MIME-typed images with the configured quality', async () => {
    const compress = vi.fn().mockResolvedValue(`data:image/jpeg;base64,${toBase64('small')}`)
    const { accepted } = await prepareAttachments(
      [staged({ format: 'image/png' })],
      { ...limits, imageCompressor: true, imageCompressLevel: 0.5 },
      compress
    )
    expect(compress).toHaveBeenCalledWith(`data:image/png;base64,${toBase64('hello')}`, 0.5)
    expect(accepted[0].file.base64).toBe(toBase64('small'))
    expect(accepted[0].file.size).toBe('0.0')
  })

  it('reports invalidFormat and continues when a file cannot be processed', async () => {
    const compress = vi.fn().mockRejectedValue(new Error('bad image'))
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { accepted, errors } = await prepareAttachments(
      [staged({ name: 'broken', format: 'image/png' }), staged({ name: 'fine' })],
      { ...limits, imageCompressor: true },
      compress
    )
    expect(accepted.map((a) => a.file.name)).toEqual(['fine.pdf'])
    expect(errors).toEqual([{ code: 'invalidFormat', fileName: 'broken' }])
  })
})
