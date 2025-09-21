<template>
  <div>
    <v-row>
      <v-col
        v-for="(attachment, index) in props.documentAttachment"
        :key="`attachment-${index}`"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="file-card"
          :shaped="props.shaped"
          :outlined="props.outlined"
          :raised="props.raised"
          :tile="props.tile"
          height="180"
        >
          <div class="d-flex align-center pa-3" style="height: 100%;">
            <!-- Left Side - File Info -->
            <div class="flex-grow-1 pr-4" style="max-width: 60%;">
              <!-- File Name -->
              <div class="text-subtitle-1 font-weight-medium mb-2" style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100%;
              ">
                {{ attachment.file.name }}
              </div>

              <!-- File Size -->
              <v-chip
                color="teal"
                variant="flat"
                size="small"
                class="text-white mb-2"
              >
                <v-icon start size="16">mdi-harddisk</v-icon>
                {{ formatFileSize(attachment.file.size) }}
              </v-chip>
            </div>

            <!-- Right Side - Thumbnail/Icon -->
            <div class="flex-shrink-0" style="min-width: 80px;">
              <!-- Image Thumbnail -->
              <div v-if="isImageFile(attachment.file.name) && props.thumb" class="thumbnail-container">
                <v-img
                  :src="getImageSrc(attachment.file)"
                  height="80"
                  width="80"
                  cover
                  class="rounded"
                ></v-img>
              </div>

              <!-- File Icon -->
              <div
                v-else
                class="d-flex align-center justify-center"
              >
                <v-icon
                  :color="getFileIconColor(attachment.file.name)"
                  size="60"
                >
                  {{ getFileIcon(attachment.file.name) }}
                </v-icon>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <v-divider class="my-2"></v-divider>

          <!-- Action Buttons -->
          <div class="d-flex gap-2 pb-1">
            <!-- Delete Button -->
            <v-tooltip bottom>
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-if="props.deletePermission"
                  icon
                  variant="text"
                  size="small"
                  v-bind="tooltipProps"
                  @click="openDeleteDialog(index, '')"
                >
                  <v-icon color="red" size="20">mdi-delete-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ props.selectedLang[lang].delete }}</span>
            </v-tooltip>

            <!-- Edit Button -->
            <v-tooltip bottom>
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-if="props.editPermission"
                  icon
                  variant="text"
                  size="small"
                  v-bind="tooltipProps"
                  @click="openEditDocumentDialog(attachment, index)"
                >
                  <v-icon color="green" size="20">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ props.selectedLang[lang].edit }}</span>
            </v-tooltip>
          </div>

          <!-- Expandable Detail Section (if needed) -->
          <v-expand-transition>
            <div v-show="attachment.file.showDetailState">
              <v-divider></v-divider>
              <v-chip-group v-if="attachment.file.tags.length" multiple active-class="primary--text" style="padding: 8px">
                <v-chip v-for="(tag, tagIndex) in attachment.file.tags" :key="`tag-${tagIndex}`" style="margin: 5px">{{ tag }}</v-chip>
              </v-chip-group>
              <v-card-text v-if="attachment.file.description" style="text-align: justify">
                {{ attachment.file.description }}
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { DocumentAttachment, LanguageCollection } from '@/types';

interface Props {
  documentAttachment: DocumentAttachment[],
  lang: string,
  thumb: boolean,
  cols: number,
  editPermission: boolean,
  cardType?: string,
  outlined?: boolean,
  raised?: boolean,
  shaped?: boolean,
  tile?: boolean,
  deletePermission: boolean,
  selectedLang: LanguageCollection
}

const props = withDefaults(defineProps<Props>(), {
  thumb: true,
  lang: "en",
  cols: 4,
  editPermission: true,
  deletePermission: true
})

const emit = defineEmits(["setCardTheme", "openDeleteDialog", "openEditDocumentDialog"])

// Helper functions
const formatFileSize = (size: number) => {
  const kb = size / 1000;
  return kb < 1024
    ? `${kb.toFixed(1)} ${props.selectedLang[props.lang].size.kb}`
    : `${(kb / 1024).toFixed(1)} ${props.selectedLang[props.lang].size.mb}`;
};

const isImageFile = (filename: string) => ['jpg', 'jpeg', 'png', 'tif', 'bmp'].includes(filename.split('.').pop()?.toLowerCase() || '');

const getImageSrc = (file: any) => {
  if (file.base64) {
    // Check if base64 already includes data URL prefix
    if (file.base64.startsWith('data:')) {
      return file.base64;
    }
    // Construct proper data URL
    return `data:${file.format};base64,${file.base64}`;
  }
  return '';
};

const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    pdf: 'mdi-file-pdf-box',
    doc: 'mdi-file-word-outline',
    docx: 'mdi-file-word-outline',
    odt: 'mdi-file-word-outline',
    jpg: 'mdi-file-image-outline',
    jpeg: 'mdi-file-image-outline',
    png: 'mdi-file-image-outline',
    tif: 'mdi-file-image-outline',
    bmp: 'mdi-file-image-outline',
    xls: 'mdi-file-excel-outline',
    xlsx: 'mdi-file-excel-outline',
    pptx: 'mdi-file-powerpoint-outline',
    pptm: 'mdi-file-powerpoint-outline',
    ppt: 'mdi-file-powerpoint-outline',
    mp4: 'mdi-file-video-outline',
    mov: 'mdi-file-video-outline',
    flv: 'mdi-file-video-outline',
    wmv: 'mdi-file-video-outline',
    avi: 'mdi-file-video-outline',
    dwg: 'mdi-file-cad',
    zip: 'mdi-folder-zip-outline',
    rar: 'mdi-folder-zip-outline',
    '7-zip': 'mdi-folder-zip-outline',
    txt: 'mdi-script-text-outline',
  };
  return extension ? iconMap[extension] || 'mdi-file-question-outline' : 'mdi-file-question-outline';
};

const getFileIconColor = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const colorMap: Record<string, string> = {
    pdf: 'red darken-1',
    doc: 'blue darken-1',
    docx: 'blue darken-1',
    odt: 'blue darken-1',
    jpg: 'deep-purple darken-1',
    jpeg: 'deep-purple darken-1',
    png: 'deep-purple darken-1',
    tif: 'deep-purple darken-1',
    bmp: 'deep-purple darken-1',
    xls: 'teal darken-1',
    xlsx: 'teal darken-1',
    pptx: 'orange darken-3',
    pptm: 'orange darken-3',
    ppt: 'orange darken-3',
    mp4: 'red lighten-1',
    mov: 'red lighten-1',
    flv: 'red lighten-1',
    wmv: 'red lighten-1',
    avi: 'red lighten-1',
    dwg: 'indigo lighten-2',
    zip: 'lime lighten-1',
    rar: 'lime lighten-1',
    '7-zip': 'lime lighten-1',
    txt: 'light-green darken-3',
  };
  return extension ? colorMap[extension] || 'indigo lighten-1' : 'indigo lighten-1';
};

// Event Handlers
const openDeleteDialog = (index: number, deleteId: string) => emit("openDeleteDialog", index, deleteId);
const openEditDocumentDialog = (item: any, index: number) => emit("openEditDocumentDialog", item, index);
</script>

<style scoped>
.file-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
}

.thumbnail-container {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  word-break: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
}

.v-chip {
  font-weight: 500;
}

.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.1);
}
</style>
