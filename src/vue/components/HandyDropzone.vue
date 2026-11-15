<template>
  <label
    class="hu-dropzone"
    :class="{ 'hu-dropzone--active': isDragging, 'hu-dropzone--disabled': disabled }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="input"
      class="hu-visually-hidden"
      type="file"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      @change="onChange"
    />
    <slot :is-dragging="isDragging">
      <span class="hu-dropzone__label">{{ label }}</span>
      <span v-if="hint" class="hu-dropzone__hint">{{ hint }}</span>
    </slot>
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    accept?: string
    multiple?: boolean
    disabled?: boolean
    label?: string
    hint?: string
  }>(),
  { accept: '', multiple: true, disabled: false, label: 'Choose files', hint: '' }
)

const emit = defineEmits<{ (e: 'files', files: File[]): void }>()

const input = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
// dragenter/dragleave also fire for child elements, so count them.
let depth = 0

function onDragEnter() {
  if (props.disabled) return
  depth++
  isDragging.value = true
}

function onDragLeave() {
  depth = Math.max(0, depth - 1)
  if (depth === 0) isDragging.value = false
}

function onDrop(event: DragEvent) {
  depth = 0
  isDragging.value = false
  if (props.disabled) return
  const files = Array.from(event.dataTransfer?.files ?? [])
  if (files.length > 0) emit('files', props.multiple ? files : files.slice(0, 1))
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  // Reset so choosing the same file again still fires change.
  target.value = ''
  if (files.length > 0) emit('files', files)
}

/** Opens the native file picker. */
function open() {
  input.value?.click()
}

defineExpose({ open })
</script>
