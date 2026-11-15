import { useEffect, useRef, useState } from 'react'
import 'handy-uploader/element' // registers <handy-uploader>
import type {
  DocumentAttachment,
  HandyUploaderChangeDetail,
  HandyUploaderElement
} from 'handy-uploader/element'

// A file the app already has (e.g. loaded from a server).
const saved: DocumentAttachment = {
    file: {
      name: 'welcome.txt',
      format: 'txt',
      base64: '',
      size: 12,
      tags: [],
      description: '',
      showDetailState: false
    }
  }

export default function App() {
  const ref = useRef<HandyUploaderElement>(null)
  const [files, setFiles] = useState<DocumentAttachment[]>([saved])
  const names = files.map((a) => a.file.name).join(', ')

  // React 18 would stringify `files` into an attribute, so set the property through the ref.
  useEffect(() => {
    if (ref.current) ref.current.files = files
  }, [files])

  // React 18 doesn't attach custom-event handlers on custom elements: use addEventListener.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onChange = (event: CustomEvent<HandyUploaderChangeDetail>) =>
      setFiles(event.detail.files)
    el.addEventListener('hu-change', onChange)
    return () => el.removeEventListener('hu-change', onChange)
  }, [])

  return (
    <main>
      <h1>handy-uploader in React 18</h1>

      <handy-uploader
        ref={ref}
        max-file-count={5}
        change-file-name
        add-file-tag
        tags="invoice, contract"
      />

      <p id="state">
        {files.length} files{names ? `: ${names}` : ''}
      </p>
      <button
        id="add-sample"
        type="button"
        onClick={() =>
          ref.current?.addFiles([
            new File(['Hello from React 18'], 'sample.txt', { type: 'text/plain' })
          ])
        }
      >
        Add sample.txt (el.addFiles)
      </button>
      <button id="clear" type="button" onClick={() => setFiles([])}>
        Clear (files = [])
      </button>
    </main>
  )
}
