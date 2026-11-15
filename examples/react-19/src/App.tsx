import { useRef, useState } from 'react'
import 'handy-uploader/element' // registers <handy-uploader>
import type { DocumentAttachment, HandyUploaderElement } from 'handy-uploader/element'

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

  return (
    <main>
      <h1>handy-uploader in React 19</h1>

      {/*
        React 19 passes `files` as a property (it exists on the element), the kebab-case
        options as attributes, and on<event-name> as an addEventListener('<event-name>').
      */}
      <handy-uploader
        ref={ref}
        files={files}
        max-file-count={5}
        change-file-name
        add-file-tag
        tags="invoice, contract"
        onhu-change={(event) => setFiles(event.detail.files)}
      />

      <p id="state">
        {files.length} files{names ? `: ${names}` : ''}
      </p>
      <button
        id="add-sample"
        type="button"
        onClick={() =>
          ref.current?.addFiles([
            new File(['Hello from React 19'], 'sample.txt', { type: 'text/plain' })
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
