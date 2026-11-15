<template>
  <div v-if="files.length === 0">
    <slot name="empty" />
  </div>

  <table v-else-if="layout === 'table'" class="hu-table">
    <thead>
      <tr>
        <th class="hu-table__thumb" scope="col"><span class="hu-visually-hidden">{{ labels.preview }}</span></th>
        <th scope="col">{{ labels.name }}</th>
        <th scope="col">{{ labels.size }}</th>
        <th v-if="hasActions" scope="col"><span class="hu-visually-hidden">{{ labels.actions }}</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(attachment, index) in files" :key="keyOf(attachment, index)">
        <td class="hu-table__thumb">
          <span class="hu-preview hu-preview--small">
            <img v-if="previewOf(attachment)" :src="previewOf(attachment)" alt="" />
            <span v-else class="hu-badge" :data-hu-type="typeOf(attachment)">{{ badgeOf(attachment) }}</span>
          </span>
        </td>
        <td class="hu-file__name" :title="attachment.file.name">{{ attachment.file.name }}</td>
        <td class="hu-file__size">{{ sizeOf(attachment) }}</td>
        <td v-if="hasActions">
          <div class="hu-file__actions">
            <slot name="actions" :attachment="attachment" :index="index" />
            <button
              v-if="removable"
              type="button"
              class="hu-button hu-button--danger"
              :aria-label="`${labels.remove} ${attachment.file.name}`"
              @click="emit('remove', index)"
            >
              {{ labels.remove }}
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <ul v-else class="hu-files" :class="`hu-files--${layout}`">
    <li v-for="(attachment, index) in files" :key="keyOf(attachment, index)" class="hu-file">
      <slot name="item" :attachment="attachment" :index="index" :remove="() => emit('remove', index)">
        <span class="hu-preview" :class="{ 'hu-preview--small': layout === 'list' }">
          <img v-if="previewOf(attachment)" :src="previewOf(attachment)" alt="" />
          <span v-else class="hu-badge" :data-hu-type="typeOf(attachment)">{{ badgeOf(attachment) }}</span>
          <span v-if="typeOf(attachment) === 'video'" class="hu-preview__play" aria-hidden="true">▶</span>
        </span>
        <span class="hu-file__info">
          <span class="hu-file__name" :title="attachment.file.name">{{ attachment.file.name }}</span>
          <span class="hu-file__size">{{ sizeOf(attachment) }}</span>
        </span>
        <span v-if="hasActions" class="hu-file__actions">
          <slot name="actions" :attachment="attachment" :index="index" />
          <button
            v-if="removable"
            type="button"
            class="hu-button hu-button--danger"
            :aria-label="`${labels.remove} ${attachment.file.name}`"
            @click="emit('remove', index)"
          >
            {{ labels.remove }}
          </button>
        </span>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import type { DocumentAttachment } from '../../types'
import {
  constructImageDataUrl,
  createVideoThumbnailCache,
  formatBytes,
  getFileType,
  splitFileName
} from '../../core'

import type { FileListLabels, FileListLayout } from '../types'

const props = withDefaults(
  defineProps<{
    files: DocumentAttachment[]
    layout?: FileListLayout
    removable?: boolean
    thumbnails?: boolean
    labels?: Partial<FileListLabels>
  }>(),
  { layout: 'grid', removable: true, thumbnails: true, labels: () => ({}) }
)

const emit = defineEmits<{ (e: 'remove', index: number): void }>()
const slots = useSlots()

const labels = computed<FileListLabels>(() => ({
  name: 'Name',
  size: 'Size',
  remove: 'Remove',
  preview: 'Preview',
  actions: 'Actions',
  kb: 'KB',
  mb: 'MB',
  ...props.labels
}))

const hasActions = computed(() => props.removable || !!slots.actions)

// Reading thumbnailVersion during render re-renders once a video thumbnail is ready.
const thumbnailVersion = ref(0)
const videoThumbnails = createVideoThumbnailCache(() => thumbnailVersion.value++)

const typeOf = (a: DocumentAttachment) => getFileType(a.file.name)

function previewOf(a: DocumentAttachment): string | undefined {
  if (!props.thumbnails || !a.file.base64) return undefined
  const type = typeOf(a)
  if (type === 'image') return constructImageDataUrl(a.file.base64, a.file.format)
  if (type === 'video') {
    void thumbnailVersion.value
    return videoThumbnails.get(a.file)
  }
  return undefined
}

function badgeOf(a: DocumentAttachment): string {
  const ext = a.file.format || splitFileName(a.file.name).format
  return ext ? ext.slice(0, 4).toUpperCase() : 'FILE'
}

const sizeOf = (a: DocumentAttachment) =>
  formatBytes(Number(a.file.size) || 0, { kb: labels.value.kb, mb: labels.value.mb })

const keyOf = (a: DocumentAttachment, index: number) =>
  `${index}-${a.file.name}-${a.file.size}`
</script>
