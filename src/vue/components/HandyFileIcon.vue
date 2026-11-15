<template>
  <svg
    class="hu-file-icon"
    :data-hu-type="type"
    viewBox="0 0 40 48"
    :width="(size * 40) / 48"
    :height="size"
    role="img"
    :aria-label="label || 'file'"
  >
    <path d="M4 0h22l14 14v30a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="currentColor" />
    <path d="M26 0v10a4 4 0 0 0 4 4h10z" fill="#fff" fill-opacity="0.45" />
    <text
      x="20"
      y="37"
      text-anchor="middle"
      font-family="system-ui, sans-serif"
      font-weight="700"
      :font-size="label.length > 3 ? 8.5 : 10"
      fill="#fff"
    >
      {{ label }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getFileType, splitFileName } from '../../core'

const props = withDefaults(defineProps<{ fileName: string; size?: number }>(), { size: 48 })

const type = computed(() => getFileType(props.fileName))
const label = computed(() => splitFileName(props.fileName).format.slice(0, 4).toUpperCase())
</script>
