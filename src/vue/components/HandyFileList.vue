<template>
  <div v-if="files.length === 0">
    <slot name="empty" />
  </div>

  <!-- Table view -->
  <div
    v-else-if="view === 'table'"
    class="hu-table-wrap"
    :class="{ 'hu-table-wrap--fixed': tableFixedHeader }"
    :style="tableFixedHeader ? { maxHeight: `${tableHeight}px` } : undefined"
  >
    <table class="hu-table">
      <thead>
        <tr>
          <th v-if="tableThumbColumn" class="hu-table__thumb" scope="col">{{ t.table.thumb }}</th>
          <th scope="col">{{ t.table.name }}</th>
          <th scope="col" class="hu-table__size">{{ t.table.size }}</th>
          <th v-if="hasActions" scope="col" class="hu-table__actions">
            {{ t.table.action.action }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(attachment, index) in files" :key="keyOf(attachment, index)">
          <td v-if="tableThumbColumn" class="hu-table__thumb">
            <span class="hu-thumb hu-thumb--small">
              <img
                v-if="previews[index]"
                :src="previews[index]"
                alt=""
                @error="onPreviewError(attachment)"
              />
              <HandyFileIcon v-else :file-name="attachment.file.name" :size="36" />
            </span>
          </td>
          <td class="hu-file__name" :title="attachment.file.name">{{ attachment.file.name }}</td>
          <td class="hu-table__size">
            <span class="hu-chip" :data-hu-size="sizeLevel(attachment)">{{
              sizeOf(attachment)
            }}</span>
          </td>
          <td v-if="hasActions">
            <div class="hu-actions">
              <slot name="actions" :attachment="attachment" :index="index" />
              <button
                v-if="editable"
                type="button"
                class="hu-icon-button hu-icon-button--edit"
                :aria-label="`${t.edit} ${attachment.file.name}`"
                :title="t.edit"
                @click="emit('edit', index)"
              >
                <HandyIcon name="pencil" :size="18" />
              </button>
              <button
                v-if="removable"
                type="button"
                class="hu-icon-button hu-icon-button--danger"
                :aria-label="`${t.delete} ${attachment.file.name}`"
                :title="t.table.action.deleteTooltip"
                @click="emit('remove', index)"
              >
                <HandyIcon name="trash" :size="18" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Thumbnail and simple views -->
  <ul
    v-else
    class="hu-files"
    :class="`hu-files--${view}`"
    :style="view === 'thumbnail' ? { '--hu-columns': columns } : undefined"
  >
    <li
      v-for="(attachment, index) in files"
      :key="keyOf(attachment, index)"
      class="hu-card"
      :class="[`hu-card--${cardType}`, `hu-card--${view}`]"
    >
      <slot
        name="item"
        :attachment="attachment"
        :index="index"
        :remove="() => emit('remove', index)"
      >
        <div v-if="view === 'thumbnail'" class="hu-card__media">
          <img
            v-if="previews[index]"
            :src="previews[index]"
            alt=""
            :class="typeOf(attachment) === 'video' ? 'hu-media--cover' : 'hu-media--contain'"
            @error="onPreviewError(attachment)"
          />
          <HandyFileIcon v-else :file-name="attachment.file.name" :size="96" />
          <span v-if="typeOf(attachment) === 'video'" class="hu-play" aria-hidden="true">
            <HandyIcon name="play" :size="28" />
          </span>
        </div>

        <div class="hu-card__content">
          <div class="hu-card__info">
            <span class="hu-file__name" :title="attachment.file.name">{{
              attachment.file.name
            }}</span>
            <span class="hu-chip">
              <HandyIcon v-if="view === 'simple'" name="disk" :size="14" />
              {{ sizeOf(attachment) }}
            </span>
          </div>
          <span v-if="view === 'simple'" class="hu-thumb">
            <img
              v-if="previews[index]"
              :src="previews[index]"
              alt=""
              @error="onPreviewError(attachment)"
            />
            <HandyFileIcon v-else :file-name="attachment.file.name" :size="60" />
          </span>
        </div>

        <div v-if="hasActions || hasDetails(attachment)" class="hu-card__actions">
          <slot name="actions" :attachment="attachment" :index="index" />
          <button
            v-if="removable"
            type="button"
            class="hu-icon-button hu-icon-button--danger"
            :aria-label="`${t.delete} ${attachment.file.name}`"
            :title="t.delete"
            @click="emit('remove', index)"
          >
            <HandyIcon name="trash" />
          </button>
          <button
            v-if="editable"
            type="button"
            class="hu-icon-button hu-icon-button--edit"
            :aria-label="`${t.edit} ${attachment.file.name}`"
            :title="t.edit"
            @click="emit('edit', index)"
          >
            <HandyIcon name="pencil" />
          </button>
          <button
            v-if="hasDetails(attachment)"
            type="button"
            class="hu-icon-button hu-details-toggle"
            :aria-expanded="isExpanded(attachment)"
            :aria-label="`${t.fileDescription} / ${t.fileTags}`"
            @click="toggle(attachment)"
          >
            <HandyIcon name="chevron" />
          </button>
        </div>

        <div v-if="isExpanded(attachment)" class="hu-card__details">
          <ul v-if="attachment.file.tags?.length" class="hu-tags" :aria-label="t.fileTags">
            <li v-for="tag in attachment.file.tags ?? []" :key="tag" class="hu-tag">{{ tag }}</li>
          </ul>
          <p v-if="attachment.file.description" class="hu-description">
            {{ attachment.file.description }}
          </p>
        </div>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import type { DocumentAttachment, Translation } from '../../types'
import {
  constructImageDataUrl,
  createVideoThumbnailCache,
  formatBytes,
  getFileType
} from '../../core'
import type { CardStyle, FileUploaderView } from '../types'
import HandyIcon from './HandyIcon.vue'
import HandyFileIcon from './HandyFileIcon.vue'

const props = withDefaults(
  defineProps<{
    files: DocumentAttachment[]
    /** Resolved translation for the current language. */
    t: Translation
    view?: FileUploaderView
    /** Show image previews and video thumbnails (the Vuetify version's `thumb`). */
    thumb?: boolean
    /** Thumbnail view: card width out of 12 columns, like Vuetify's `md` (3 = 4 per row). */
    cols?: number
    cardType?: CardStyle
    editable?: boolean
    removable?: boolean
    tableThumbColumn?: boolean
    tableFixedHeader?: boolean
    tableHeight?: number
  }>(),
  {
    view: 'thumbnail',
    thumb: true,
    cols: 3,
    cardType: 'default',
    editable: true,
    removable: true,
    tableThumbColumn: true,
    tableFixedHeader: true,
    tableHeight: 400
  }
)

const emit = defineEmits<{
  (e: 'remove', index: number): void
  (e: 'edit', index: number): void
}>()
const slots = useSlots()

const hasActions = computed(() => props.removable || props.editable || !!slots.actions)
const columns = computed(() => Math.max(1, Math.round(12 / Math.min(12, Math.max(1, props.cols)))))

// Bumped when a video thumbnail is ready, so `previews` recomputes.
const thumbnailVersion = ref(0)
const videoThumbnails = createVideoThumbnailCache(() => thumbnailVersion.value++)

// Image data URLs are cached per file object, so re-renders reuse the same string and
// the browser does not re-decode the image.
const imageUrls = new WeakMap<object, string>()

const typeOf = (a: DocumentAttachment) => getFileType(a.file.name)

// Previews that failed to load (corrupt image, unsupported format): show the file icon instead.
const failedPreviews = ref(new WeakSet<object>())
function onPreviewError(a: DocumentAttachment) {
  if (typeOf(a) === 'video') {
    videoThumbnails.invalidate(a.file) // retries once, then gives up
    return
  }
  const next = new WeakSet<object>([a.file])
  for (const item of props.files) if (failedPreviews.value.has(item.file)) next.add(item.file)
  failedPreviews.value = next
}

function previewOf(a: DocumentAttachment): string | undefined {
  if (!props.thumb || !a.file.base64 || failedPreviews.value.has(a.file)) return undefined
  const type = typeOf(a)
  if (type === 'image') {
    let url = imageUrls.get(a.file)
    if (!url) {
      url = constructImageDataUrl(a.file.base64, a.file.format)
      imageUrls.set(a.file, url)
    }
    return url
  }
  if (type === 'video') return videoThumbnails.get(a.file)
  return undefined
}

const previews = computed(() => {
  void thumbnailVersion.value
  return props.files.map(previewOf)
})

// Free thumbnails of videos that were removed from the list.
watch(
  () => props.files,
  (files) => videoThumbnails.retain(files.map((a) => a.file))
)

// Expanded details (tags/description), tracked per file object.
const expanded = ref(new WeakSet<object>())
const isExpanded = (a: DocumentAttachment) => expanded.value.has(a.file)
function toggle(a: DocumentAttachment) {
  const next = new WeakSet<object>()
  for (const item of props.files) {
    if (item.file !== a.file && expanded.value.has(item.file)) next.add(item.file)
  }
  if (!expanded.value.has(a.file)) next.add(a.file)
  expanded.value = next
}
const hasDetails = (a: DocumentAttachment) => (a.file.tags?.length ?? 0) > 0 || !!a.file.description

const bytesOf = (a: DocumentAttachment) => Number(a.file.size) || 0
const sizeOf = (a: DocumentAttachment) => formatBytes(bytesOf(a), props.t.size)
/** Colour level for the table's size chip, as in the Vuetify version: <1 MB, <5 MB, larger. */
function sizeLevel(a: DocumentAttachment): 'small' | 'medium' | 'large' {
  const mb = bytesOf(a) / (1024 * 1024)
  return mb < 1 ? 'small' : mb < 5 ? 'medium' : 'large'
}

const keyOf = (a: DocumentAttachment, index: number) => `${index}-${a.file.name}-${a.file.size}`
</script>
