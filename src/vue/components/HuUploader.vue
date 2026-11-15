<template>
  <div class="hu-uploader" :dir="isRtl ? 'rtl' : undefined">
    <HuDropzone
      :accept="accept"
      :disabled="disabled || !uploader.canAddMore.value"
      :label="t.insertFile"
      :hint="hint"
      @files="addFiles"
    >
      <template v-if="$slots.dropzone" #default="slotProps">
        <slot name="dropzone" v-bind="slotProps" />
      </template>
    </HuDropzone>

    <p v-if="uploader.isProcessing.value" class="hu-status" role="status">…</p>

    <ul v-if="messages.length > 0" class="hu-errors" role="alert">
      <li v-for="(message, i) in messages" :key="i">{{ message }}</li>
    </ul>

    <HuFileList
      :files="model"
      :layout="layout"
      :removable="removable && !disabled"
      :thumbnails="thumbnails"
      :labels="listLabels"
      @remove="onRemove"
    >
      <template v-if="$slots.item" #item="slotProps">
        <slot name="item" v-bind="slotProps" />
      </template>
      <template v-if="$slots.actions" #actions="slotProps">
        <slot name="actions" v-bind="slotProps" :update="uploader.update" />
      </template>
      <template #empty>
        <slot name="empty" />
      </template>
    </HuFileList>
  </div>
</template>

<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import type { DocumentAttachment, LanguageCode, LanguageCollection, Translation } from '../../types'
import { formatBytes, type AttachmentError } from '../../core'
import { languages } from '../../lib/language'
import { useUploader } from '../useUploader'
import HuDropzone from './HuDropzone.vue'
import HuFileList from './HuFileList.vue'
import type { FileListLayout } from '../types'

const props = withDefaults(
  defineProps<{
    modelValue?: DocumentAttachment[]
    layout?: FileListLayout
    /** Maximum size per file, in bytes. */
    maxFileSize?: number
    maxFileCount?: number
    /** Same format as the HTML accept attribute, e.g. ".pdf,image/*". */
    accept?: string
    imageCompressor?: boolean
    imageCompressLevel?: number
    removable?: boolean
    thumbnails?: boolean
    disabled?: boolean
    lang?: LanguageCode
    customLang?: LanguageCollection | null
    /** Right-to-left layout. Defaults to on for Persian and Arabic. */
    rtl?: boolean
  }>(),
  {
    modelValue: () => [],
    layout: 'grid',
    maxFileSize: 5 * 1024 * 1024,
    maxFileCount: 10,
    accept: '',
    imageCompressor: false,
    imageCompressLevel: 0.8,
    removable: true,
    thumbnails: true,
    disabled: false,
    lang: 'en',
    customLang: null,
    rtl: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: DocumentAttachment[]): void
  (e: 'add', added: DocumentAttachment[]): void
  (e: 'remove', removed: DocumentAttachment, index: number): void
  (e: 'error', errors: AttachmentError[]): void
}>()

// Local copy so several quick adds build on each other even before the parent re-renders,
// and so the component also works without v-model.
const local = shallowRef<DocumentAttachment[]>(props.modelValue)
watch(
  () => props.modelValue,
  (value) => {
    local.value = value
  }
)
const model = computed<DocumentAttachment[]>({
  get: () => local.value,
  set: (value) => {
    local.value = value
    emit('update:modelValue', value)
  }
})

const uploader = useUploader(model, () => ({
  maxFileSize: props.maxFileSize,
  maxFileCount: props.maxFileCount,
  accept: props.accept,
  imageCompressor: props.imageCompressor,
  imageCompressLevel: props.imageCompressLevel
}))

const englishFallback: Required<Pick<Translation, 'fileTypeAlert' | 'invalidFileAlert' | 'dropHint'>> = {
  fileTypeAlert: 'File type is not allowed',
  invalidFileAlert: 'File could not be processed',
  dropHint: 'or drag and drop here'
}

const t = computed(() => {
  const collection = (props.customLang ?? languages) as LanguageCollection
  return { ...englishFallback, ...languages.en, ...collection[props.lang] }
})

const isRtl = computed(() => props.rtl ?? (props.lang === 'fa' || props.lang === 'ar'))

const units = computed(() => ({ kb: t.value.size.kb, mb: t.value.size.mb }))

const hint = computed(
  () =>
    `${t.value.dropHint} · ${uploader.count.value}/${props.maxFileCount} · ≤ ${formatBytes(props.maxFileSize, units.value)}`
)

const listLabels = computed(() => ({
  name: t.value.table.name,
  size: t.value.table.size,
  remove: t.value.delete,
  preview: t.value.table.thumb,
  actions: t.value.table.action.action,
  ...units.value
}))

function messageFor(error: AttachmentError): string {
  const prefix = error.fileName ? `${error.fileName}: ` : ''
  switch (error.code) {
    case 'maxFileCount':
      return `${t.value.maxFileCountAlert} ${error.limit}`
    case 'maxFileSize':
      return `${prefix}${t.value.maxFileSizeAlert} ${formatBytes(error.limit ?? 0, units.value)}`
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

async function addFiles(files: FileList | File[]) {
  const added = await uploader.add(files)
  if (added.length > 0) emit('add', added)
  return added
}

function onRemove(index: number) {
  const removed = model.value[index]
  uploader.remove(index)
  if (removed) emit('remove', removed, index)
}

defineExpose({
  add: addFiles,
  remove: onRemove,
  update: uploader.update,
  clear: uploader.clear
})
</script>
