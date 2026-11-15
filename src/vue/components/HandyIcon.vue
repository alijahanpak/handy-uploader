<template>
  <svg
    class="hu-icon"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="paths[name]" />
  </svg>
</template>

<script setup lang="ts">
import type { IconName } from '../types'

// Inline SVG icons, so the components need no icon font (Material Design Icons etc.).
const paths = {
  trash:
    'M9 3h6l1 1h4v2H4V4h4l1-1zM6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7zm4 3v9h1.5v-9H10zm3.5 0v9H15v-9h-1.5z',
  pencil:
    'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  chevron: 'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  close:
    'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
  play: 'M8 5v14l11-7L8 5z',
  upload: 'M5 20h14v-2H5v2zM12 4 6.5 9.5l1.42 1.42L11 7.83V16h2V7.83l3.08 3.09L17.5 9.5 12 4z',
  disk: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm6 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 18a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'
} satisfies Record<IconName, string>

withDefaults(defineProps<{ name: IconName; size?: number | string }>(), { size: 20 })
</script>
