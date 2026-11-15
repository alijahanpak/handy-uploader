<script>
  import 'handy-uploader/element' // registers <handy-uploader>

  /** @type {import('handy-uploader/element').HandyUploaderElement} */
  let el
  /** A file the app already has (e.g. loaded from a server). */
  const saved = {
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

  /** @type {import('handy-uploader/element').DocumentAttachment[]} */
  let files = $state.raw([saved]) // replaced, never mutated: no deep proxy needed
  let names = $derived(files.map((a) => a.file.name).join(', '))

  function addSample() {
    el.addFiles([new File(['Hello from Svelte 5'], 'sample.txt', { type: 'text/plain' })])
  }
</script>

<main>
  <h1>handy-uploader in Svelte 5</h1>

  <!--
    Svelte 5 sets `files` as a property (it exists on the element), the kebab-case options
    as attributes, and on<event-name> adds an event listener.
  -->
  <handy-uploader
    bind:this={el}
    files={files}
    max-file-count="5"
    change-file-name
    add-file-tag
    tags="invoice, contract"
    onhu-change={(event) => (files = event.detail.files)}
  ></handy-uploader>

  <p id="state">{files.length} files{names ? `: ${names}` : ''}</p>
  <button id="add-sample" type="button" onclick={addSample}>Add sample.txt (el.addFiles)</button>
  <button id="clear" type="button" onclick={() => (files = [])}>Clear (files = [])</button>
</main>
