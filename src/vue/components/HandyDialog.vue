<template>
  <dialog ref="el" class="hu-dialog" :class="`hu-dialog--${size}`" :aria-labelledby="titleId" @cancel.prevent="close">
    <div class="hu-dialog__panel">
      <header class="hu-dialog__header">
        <h2 :id="titleId" class="hu-dialog__title">{{ title }}</h2>
        <button type="button" class="hu-icon-button" :aria-label="closeLabel" @click="close">
          <HandyIcon name="close" />
        </button>
      </header>
      <div class="hu-dialog__body">
        <slot />
      </div>
      <footer v-if="$slots.actions" class="hu-dialog__actions">
        <slot name="actions" />
      </footer>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import HandyIcon from './HandyIcon.vue'

const props = withDefaults(
  defineProps<{ open: boolean; title?: string; closeLabel?: string; size?: 'small' | 'medium' }>(),
  { title: '', closeLabel: 'Close', size: 'medium' }
)
const emit = defineEmits<{ (e: 'update:open', value: boolean): void }>()

let uid = 0
const titleId = `hu-dialog-title-${++uid}-${Math.random().toString(36).slice(2, 8)}`
const el = ref<HTMLDialogElement | null>(null)

function sync(open: boolean) {
  const dialog = el.value
  if (!dialog) return
  if (open && !dialog.open) {
    // Native modal dialog: focus trap, Esc and top layer for free. Fallback for old engines.
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
  } else if (!open && dialog.open) {
    if (typeof dialog.close === 'function') dialog.close()
    else dialog.removeAttribute('open')
  }
}

function close() {
  emit('update:open', false)
}

watch(() => props.open, sync)
onMounted(() => sync(props.open))
</script>
