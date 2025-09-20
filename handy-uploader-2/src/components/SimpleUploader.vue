<template>
  <div>
    <v-row>
      <v-col
        v-for="(attachment, index) in props.documentAttachment"
        :key="`attachment-${index}`"
        cols="12"
        :md="props.cols"
        xs="12"
      >
        <v-card
          :shaped="props.shaped"
          :outlined="props.outlined"
          :raised="props.raised"
          :tile="props.tile"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-subtitle color="blue-grey darken-3">
                {{ attachment.file.name }}
              </v-list-item-subtitle>

              <!-- File Size Display -->
              <v-list-item-subtitle>
                <v-chip color="teal lighten-2" label text-color="white">
                  {{ formatFileSize(attachment.file.size) }}
                  <v-icon right>mdi-harddisk</v-icon>
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item>
              <template #prepend>
                <v-avatar size="80" color="blue-grey lighten-5">
                  <v-img
                    v-if="isImageFile(attachment.file.name) && props.thumb"
                    :src="'data:' + attachment.file.format + ',' + attachment.file.base64"
                  ></v-img>
                  <v-icon
                    v-else
                    :color="getFileIconColor(attachment.file.name)"
                    size="50"
                  >
                    {{ getFileIcon(attachment.file.name) }}
                  </v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>File Title Here</v-list-item-title>
            </v-list-item>
          </v-list-item>

          <v-divider class="mx-4"></v-divider>
          <v-card-actions style="padding: 0">
            <!-- Delete Button with Tooltip -->
            <v-tooltip right>
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-if="props.deletePermission"
                  text
                  fab
                  v-bind="tooltipProps"
                  @click="openDeleteDialog(index, '')"
                >
                  <v-icon color="red">mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ props.selectedLang[lang].delete }}</span>
            </v-tooltip>

            <!-- Edit Button with Tooltip -->
            <v-tooltip right>
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-if="props.editPermission"
                  text
                  fab
                  v-bind="tooltipProps"
                  @click="openEditDocumentDialog(attachment, index)"
                >
                  <v-icon color="green">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
              <span>{{ props.selectedLang[lang].edit }}</span>
            </v-tooltip>

            <v-spacer></v-spacer>

            <!-- Detail Toggle Button -->
            <v-btn
              v-if="attachment.file.tags.length > 0 || attachment.file.description"
              icon
              @click.prevent="attachment.file.showDetailState = !attachment.file.showDetailState"
            >
              <v-icon>{{ attachment.file.showDetailState ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Expandable Detail Section -->
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

const getFileIcon = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const iconMap: Record<string, string> = {
    pdf: 'mdi-file-pdf-outline',
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
