import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  computed,
  signal,
  viewChild
} from '@angular/core'
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

@Component({
  selector: 'app-root',
  // Lets Angular accept <handy-uploader> and bind to its properties and events.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <h1>handy-uploader in Angular</h1>

    <!-- [files] sets the JS property; plain attributes are options; (hu-change) listens. -->
    <handy-uploader
      #uploader
      [files]="files()"
      max-file-count="5"
      change-file-name
      add-file-tag
      tags="invoice, contract"
      (hu-change)="onChange($event)"
    ></handy-uploader>

    <p id="state">{{ files().length }} files{{ names() ? ': ' + names() : '' }}</p>
    <button id="add-sample" type="button" (click)="addSample()">Add sample.txt (el.addFiles)</button>
    <button id="clear" type="button" (click)="files.set([])">Clear (files = [])</button>
  `
})
export class AppComponent {
  readonly files = signal<DocumentAttachment[]>([saved])
  readonly names = computed(() =>
    this.files()
      .map((a) => a.file.name)
      .join(', ')
  )
  private readonly uploader = viewChild.required<ElementRef<HandyUploaderElement>>('uploader')

  onChange(event: Event) {
    this.files.set((event as CustomEvent<HandyUploaderChangeDetail>).detail.files)
  }

  addSample() {
    this.uploader().nativeElement.addFiles([
      new File(['Hello from Angular'], 'sample.txt', { type: 'text/plain' })
    ])
  }
}
