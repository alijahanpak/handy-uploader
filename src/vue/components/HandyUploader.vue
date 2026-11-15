<template>
  <div class="hu-uploader" :dir="isRtl ? 'rtl' : undefined">
    <div v-if="insertPermission" class="hu-toolbar">
      <span class="hu-badge-wrap">
        <button
          type="button"
          class="hu-button hu-button--primary"
          :style="buttonStyle"
          :disabled="!uploader.canAddMore.value"
          @click="openInsert"
        >
          <HandyIcon name="upload" :size="18" />
          {{ t.insertFile }}
        </button>
        <span
          v-if="badgeCounter && files.length > 0"
          class="hu-count"
          :data-hu-full="files.length >= maxFileCount"
          :aria-label="`${files.length} / ${maxFileCount}`"
        >
          {{ files.length }}
        </span>
      </span>
    </div>

    <div v-if="messages.length > 0 && !insertOpen" class="hu-alert" role="alert">
      <ul>
        <li v-for="(message, i) in messages" :key="i">{{ message }}</li>
      </ul>
      <button
        type="button"
        class="hu-icon-button"
        :aria-label="t.deleteDialog.cancel"
        @click="uploader.dismissErrors"
      >
        <HandyIcon name="close" :size="16" />
      </button>
    </div>

    <HandyFileList
      :files="files"
      :t="t"
      :view="fileUploaderType"
      :thumb="thumb"
      :cols="cols"
      :card-type="cardType"
      :editable="editPermission && canEditAnything"
      :removable="deletePermission"
      :table-thumb-column="tableThumbColumn"
      :table-fixed-header="tableFixedHeader"
      :table-height="tableHeight"
      @remove="askDelete"
      @edit="openEdit"
    >
      <template v-if="$slots.item" #item="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>
      <template v-if="$slots.actions" #actions="slotProps">
        <slot name="actions" v-bind="slotProps" />
      </template>
      <template #empty>
        <slot name="empty" />
      </template>
    </HandyFileList>

    <!-- Insert: pick or drop files, optionally set name/description/tags, then add -->
    <HandyDialog
      v-model:open="insertOpen"
      :title="t.insertNewFile"
      :close-label="t.deleteDialog.cancel"
    >
      <HandyDropzone
        :accept="fileAccept"
        :disabled="staged.length + files.length >= maxFileCount"
        :label="t.insertFile"
        :hint="hint"
        @files="onPick"
      />
      <p v-if="uploader.isProcessing.value" class="hu-status" role="status">…</p>
      <ul v-if="messages.length > 0" class="hu-alert hu-alert--inline" role="alert">
        <li v-for="(message, i) in messages" :key="i">{{ message }}</li>
      </ul>
      <ul v-if="staged.length > 0" class="hu-staged">
        <li v-for="(item, index) in staged" :key="index" class="hu-staged__item">
          <HandyFileIcon :file-name="joinFileName(item.file.name, item.file.format)" :size="40" />
          <div class="hu-staged__fields">
            <label v-if="changeFileName" class="hu-field">
              <span class="hu-field__label">{{ t.fileName }}</span>
              <span class="hu-field__row">
                <input v-model="item.file.name" class="hu-input" type="text" />
                <span v-if="item.file.format" class="hu-field__suffix"
                  >.{{ item.file.format }}</span
                >
              </span>
            </label>
            <span v-else class="hu-file__name">{{
              joinFileName(item.file.name, item.file.format)
            }}</span>
            <label v-if="addFileDescription" class="hu-field">
              <span class="hu-field__label">{{ t.fileDescription }}</span>
              <textarea
                class="hu-input"
                rows="2"
                :value="item.file.description ?? ''"
                @input="item.file.description = ($event.target as HTMLTextAreaElement).value"
              />
            </label>
            <fieldset v-if="addFileTag && tags.length" class="hu-field">
              <legend class="hu-field__label">{{ t.fileTags }}</legend>
              <span class="hu-tag-picker">
                <label v-for="tag in tags" :key="tag" class="hu-tag hu-tag--selectable">
                  <input v-model="item.file.tags" type="checkbox" :value="tag" />
                  {{ tag }}
                </label>
              </span>
            </fieldset>
          </div>
          <button
            type="button"
            class="hu-icon-button"
            :aria-label="`${t.delete} ${joinFileName(item.file.name, item.file.format)}`"
            @click="staged.splice(index, 1)"
          >
            <HandyIcon name="close" :size="18" />
          </button>
        </li>
      </ul>
      <template #actions>
        <button type="button" class="hu-button" @click="insertOpen = false">
          {{ t.deleteDialog.cancel }}
        </button>
        <button
          type="button"
          class="hu-button hu-button--primary"
          :style="buttonStyle"
          :disabled="staged.length === 0 || uploader.isProcessing.value"
          @click="confirmInsert"
        >
          {{ t.add }}
        </button>
      </template>
    </HandyDialog>

    <!-- Edit name / description / tags of an existing file -->
    <HandyDialog v-model:open="editOpen" :title="t.edit" :close-label="t.deleteDialog.cancel">
      <div v-if="editIndex !== null && files[editIndex]" class="hu-edit">
        <div class="hu-staged__fields">
          <label v-if="changeFileName" class="hu-field">
            <span class="hu-field__label">{{ t.fileName }}</span>
            <input v-model="editForm.name" class="hu-input" type="text" />
          </label>
          <label v-if="addFileDescription" class="hu-field">
            <span class="hu-field__label">{{ t.fileDescription }}</span>
            <textarea v-model="editForm.description" class="hu-input" rows="3" />
          </label>
          <fieldset v-if="addFileTag && tags.length" class="hu-field">
            <legend class="hu-field__label">{{ t.fileTags }}</legend>
            <span class="hu-tag-picker">
              <label v-for="tag in tags" :key="tag" class="hu-tag hu-tag--selectable">
                <input v-model="editForm.tags" type="checkbox" :value="tag" />
                {{ tag }}
              </label>
            </span>
          </fieldset>
        </div>
        <HandyFileIcon :file-name="files[editIndex].file.name" :size="60" />
      </div>
      <template #actions>
        <button type="button" class="hu-button" @click="editOpen = false">
          {{ t.deleteDialog.cancel }}
        </button>
        <button
          type="button"
          class="hu-button hu-button--primary"
          :style="buttonStyle"
          @click="confirmEdit"
        >
          {{ t.edit }}
        </button>
      </template>
    </HandyDialog>

    <!-- Delete confirmation -->
    <HandyDialog
      v-model:open="deleteOpen"
      :title="t.delete"
      :close-label="t.deleteDialog.cancel"
      size="small"
    >
      <p class="hu-dialog__message">{{ t.deleteDialog.message }}</p>
      <template #actions>
        <button type="button" class="hu-button" @click="deleteOpen = false">
          {{ t.deleteDialog.cancel }}
        </button>
        <button type="button" class="hu-button hu-button--danger-solid" @click="confirmDelete">
          {{ t.delete }}
        </button>
      </template>
    </HandyDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, isReadonly, reactive, ref, watch } from 'vue'
import type {
  CardType,
  DocumentAttachment,
  FileUploaderType,
  LanguageCode,
  LanguageCollection,
  Translation
} from '../../types'
import { formatBytes, joinFileName, type AttachmentError } from '../../core'
import { languages } from '../../lib/language'
import { useUploader } from '../useUploader'
import HandyDialog from './HandyDialog.vue'
import HandyDropzone from './HandyDropzone.vue'
import HandyFileIcon from './HandyFileIcon.vue'
import HandyFileList from './HandyFileList.vue'
import HandyIcon from './HandyIcon.vue'

// Same props, defaults and events as the Vuetify HandyUploader ('handy-uploader/vuetify'),
// so switching between them is only a change of import.
const props = withDefaults(
  defineProps<{
    documentAttachment?: DocumentAttachment[]
    /** A built-in language code, or a key you added with customLang. */
    lang?: LanguageCode | (string & {})
    /** Maximum size per file, in bytes. */
    maxFileSize?: number
    fileUploaderType?: FileUploaderType
    maxFileCount?: number
    badgeCounter?: boolean
    /** A colour for the buttons: a Vuetify name (primary, info, success…) or any CSS colour. */
    btnColor?: string
    imageCompressor?: boolean
    imageCompressLevel?: number
    /** HTML accept format, e.g. ".pdf,image/*". Also applied to dropped files. */
    fileAccept?: string
    thumb?: boolean
    tableThumbColumn?: boolean
    tableFixedHeader?: boolean
    tableHeight?: number
    rtlSupport?: boolean
    changeFileName?: boolean
    addFileDescription?: boolean
    addFileTag?: boolean
    tags?: string[]
    customLang?: LanguageCollection | null
    insertPermission?: boolean
    cols?: number
    editPermission?: boolean
    deletePermission?: boolean
    cardType?: CardType
  }>(),
  {
    documentAttachment: () => [],
    lang: 'en',
    maxFileSize: 5242880,
    fileUploaderType: 'thumbnail',
    maxFileCount: 10,
    badgeCounter: true,
    btnColor: 'info',
    imageCompressor: false,
    imageCompressLevel: 0.8,
    fileAccept: '',
    thumb: true,
    tableThumbColumn: true,
    tableFixedHeader: true,
    tableHeight: 400,
    rtlSupport: false,
    changeFileName: false,
    addFileDescription: false,
    addFileTag: false,
    tags: () => [],
    customLang: null,
    insertPermission: true,
    cols: 3,
    editPermission: true,
    deletePermission: true,
    cardType: 'default'
  }
)

const emit = defineEmits([
  'updateDocumentAttachment',
  'update:documentAttachment',
  'add',
  'remove',
  'error',
  'updateCardType',
  'updateBadgeCounter',
  'updateMaxFileCount',
  'updateMaxFileSize',
  'updateImageCompressor',
  'updateImageCompressLevel',
  'updateFileAccept',
  'updateThumb',
  'updateChangeFileName',
  'updateAddFileDescription',
  'updateAddFileTag',
  'updateTableThumbColumn',
  'updateTableFixedHeader',
  'updateTableHeight',
  'updateLang'
])

// Like the Vuetify version, changes are applied to the array you pass in (so it works
// without a listener) and then emitted as updateDocumentAttachment / update:documentAttachment.
const version = ref(0)
const files = computed<DocumentAttachment[]>(() => {
  void version.value
  return [...props.documentAttachment]
})
watch(
  () => props.documentAttachment,
  () => version.value++,
  { deep: false }
)
const model = computed<DocumentAttachment[]>({
  // A fresh copy on every change, so counts stay right even for non-reactive arrays.
  get: () => files.value,
  set: (next) => {
    const target = props.documentAttachment
    // Frozen or readonly arrays (e.g. from a store) can't be updated in place: emit a new one.
    if (Object.isFrozen(target) || isReadonly(target)) {
      emit('updateDocumentAttachment', next)
      emit('update:documentAttachment', next)
      return
    }
    target.splice(0, target.length, ...next)
    version.value++
    emit('updateDocumentAttachment', target)
    emit('update:documentAttachment', target)
  }
})

const uploader = useUploader(model, () => ({
  maxFileSize: props.maxFileSize,
  maxFileCount: props.maxFileCount,
  accept: props.fileAccept,
  imageCompressor: props.imageCompressor,
  imageCompressLevel: props.imageCompressLevel
}))

// The Vuetify version echoes these props back as update* events; kept for compatibility.
const echoed: Record<string, string> = {
  cardType: 'updateCardType',
  badgeCounter: 'updateBadgeCounter',
  maxFileCount: 'updateMaxFileCount',
  maxFileSize: 'updateMaxFileSize',
  imageCompressor: 'updateImageCompressor',
  imageCompressLevel: 'updateImageCompressLevel',
  fileAccept: 'updateFileAccept',
  thumb: 'updateThumb',
  changeFileName: 'updateChangeFileName',
  addFileDescription: 'updateAddFileDescription',
  addFileTag: 'updateAddFileTag',
  tableThumbColumn: 'updateTableThumbColumn',
  tableFixedHeader: 'updateTableFixedHeader',
  tableHeight: 'updateTableHeight',
  lang: 'updateLang'
}
for (const [prop, event] of Object.entries(echoed)) {
  watch(
    () => (props as Record<string, unknown>)[prop],
    (value) => (emit as (name: string, ...args: unknown[]) => void)(event, value)
  )
}

// Translations
const englishFallback = {
  fileTypeAlert: 'File type is not allowed',
  invalidFileAlert: 'File could not be processed',
  dropHint: 'or drag and drop here'
}
const t = computed<Translation>(() => {
  const collection = (props.customLang ?? languages) as LanguageCollection
  return { ...englishFallback, ...languages.en, ...collection[props.lang] } as Translation
})
const isRtl = computed(() => props.rtlSupport || props.lang === 'fa' || props.lang === 'ar')

const hint = computed(() => {
  const count = `${files.value.length + staged.value.length}/${props.maxFileCount}`
  const limit = formatBytes(props.maxFileSize, t.value.size)
  return `${t.value.dropHint} · ${count} · ≤ ${limit}`
})

// Button colour: Vuetify's colour names or any CSS colour.
const VUETIFY_COLORS: Record<string, string> = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#82b1ff',
  error: '#ff5252',
  info: '#2196f3',
  success: '#4caf50',
  warning: '#fb8c00'
}
const buttonStyle = computed(() => {
  const color = VUETIFY_COLORS[props.btnColor] ?? props.btnColor
  return color ? { '--hu-button-bg': color } : undefined
})

const canEditAnything = computed(
  () =>
    props.changeFileName || props.addFileDescription || (props.addFileTag && props.tags.length > 0)
)

// Errors
function messageFor(error: AttachmentError): string {
  const prefix = error.fileName ? `${error.fileName}: ` : ''
  switch (error.code) {
    case 'maxFileCount':
      return `${t.value.maxFileCountAlert} ${error.limit}`
    case 'maxFileSize':
      return `${prefix}${t.value.maxFileSizeAlert} ${formatBytes(error.limit ?? 0, t.value.size)}`
    case 'fileType':
      return `${prefix}${t.value.fileTypeAlert}`
    default:
      return `${prefix}${t.value.invalidFileAlert}`
  }
}
const messages = computed(() => uploader.errors.value.map(messageFor))
watch(uploader.errors, (errors) => {
  if (errors.length > 0) emit('error', errors)
})

// Insert dialog
const insertOpen = ref(false)
const staged = ref<DocumentAttachment[]>([])

// Each opening of the insert dialog is a session; reads from an older session are dropped.
let session = 0

function openInsert() {
  session++
  staged.value = []
  uploader.dismissErrors()
  insertOpen.value = true
}

async function onPick(picked: File[]) {
  const current = session
  // Count already-staged files when this read actually runs, after earlier picks.
  const result = await uploader.stage(picked, () => staged.value.length)
  if (current === session && insertOpen.value) staged.value.push(...result)
}

async function confirmInsert() {
  const added = await uploader.commit(staged.value)
  if (added.length > 0) emit('add', added)
  staged.value = []
  insertOpen.value = false
}

/** Programmatic add (via a template ref): validates, reads and adds, emitting `add`. */
async function addFiles(picked: FileList | File[]) {
  const added = await uploader.add(picked)
  if (added.length > 0) emit('add', added)
  return added
}

/** Programmatic remove (via a template ref), without the confirmation dialog. */
function removeAt(index: number) {
  const removed = files.value[index]
  if (!removed) return
  uploader.remove(index)
  emit('remove', removed, index)
}

watch(insertOpen, (open) => {
  if (!open) {
    session++
    staged.value = []
  }
})

// Edit dialog
const editOpen = ref(false)
const editIndex = ref<number | null>(null)
const editForm = reactive({ name: '', description: '', tags: [] as string[] })

function openEdit(index: number) {
  const file = files.value[index]?.file
  if (!file) return
  editIndex.value = index
  editForm.name = file.name
  editForm.description = file.description ?? ''
  editForm.tags = [...(file.tags ?? [])]
  editOpen.value = true
}

function confirmEdit() {
  if (editIndex.value !== null) {
    uploader.update(editIndex.value, {
      ...(props.changeFileName ? { name: editForm.name } : {}),
      ...(props.addFileDescription ? { description: editForm.description } : {}),
      ...(props.addFileTag ? { tags: [...editForm.tags] } : {})
    })
  }
  editOpen.value = false
}

// Delete confirmation
const deleteOpen = ref(false)
const deleteIndex = ref<number | null>(null)

function askDelete(index: number) {
  deleteIndex.value = index
  deleteOpen.value = true
}

function confirmDelete() {
  if (deleteIndex.value !== null) removeAt(deleteIndex.value)
  deleteOpen.value = false
}

defineExpose({
  add: addFiles,
  remove: removeAt,
  update: uploader.update,
  clear: uploader.clear,
  openInsert
})
</script>
