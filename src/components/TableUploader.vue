<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-table
          :fixed-header="props.tableFixedHeader"
          :height="props.tableHeight + 'px'"
          class="elevation-1"
        >
          <thead>
            <tr>
              <th class="text-left" style="width: 80px;">
                {{ props.selectedLang[lang].table.thumb }}
              </th>
              <th class="text-center">{{ props.selectedLang[lang].table.name }}</th>
              <th class="text-left" style="width: 120px;">{{ props.selectedLang[lang].table.size }}</th>
              <th class="text-left" style="width: 120px;">
                {{ props.selectedLang[lang].table.action.action }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(attachment, index) in props.documentAttachment"
              :key="`attachment-${index}`"
              class="table-row"
            >
              <td class="text-center pa-3">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <div class="d-flex justify-center align-center" style="height: 60px; width: 60px;" v-bind="tooltipProps">
                      <template v-if="safeIsImageFile(attachment.file.name)">
                        <v-img
                          style="height: 40px; width: 40px;"
                          v-if="props.thumb && attachment.file.base64"
                          :src="'data:' + attachment.file.format + ';base64,' + attachment.file.base64"
                          height="40"
                          width="40"
                          class="rounded"
                          contain
                        ></v-img>
                        <v-icon
                          v-else
                          size="40"
                          color="deep-purple"
                        >
                          mdi-file-image-outline
                        </v-icon>
                      </template>
                      <template v-else>
                        <v-icon
                  :icon="getFileIconName(attachment.file.name)"
                  :color="getFileIconColor(attachment.file.name)"
                          size="40"
                        ></v-icon>
                      </template>
                    </div>
                  </template>
                  <span>{{ attachment.file.name }}</span>
                </v-tooltip>
              </td>
              <td class="text-left pa-3">
                <v-tooltip location="top">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <span v-bind="tooltipProps">
                      {{ (() => {
                        const ext = attachment.file.name.split('.').pop();
                        const base = attachment.file.name.slice(0, attachment.file.name.lastIndexOf('.'));
                        const shortBase = base.length > 10 ? base.slice(0, 10) + '...' : base;
                        return `${shortBase}.${ext}`;
                      })() }}
                    </span>
                  </template>
                  <span>{{ attachment.file.name }}</span>
                </v-tooltip>
              </td>
              <td class="text-left pa-3">
                <v-chip
                  :color="getFileSizeColor(attachment.file.size)"
                  variant="tonal"
                  size="small"
                  class="text-caption"
                >
                  {{ formatFileSize(attachment.file.size) }}
                </v-chip>
              </td>
              <td class="text-center pa-2">
                <div class="d-flex justify-center ga-1">
                  <v-tooltip location="top" v-if="editPermission">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-btn
                        icon
                        size="small"
                        color="success"
                        variant="text"
                        v-bind="tooltipProps"
                        @click="openEditDocumentDialog(attachment, index)"
                      >
                        <v-icon size="18">mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ selectedLang[lang].edit }}</span>
                  </v-tooltip>
                  
                  <v-tooltip location="top" v-if="deletePermission">
                    <template v-slot:activator="{ props: tooltipProps }">
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        v-bind="tooltipProps"
                        @click="openDeleteDialog(index, '')"
                      >
                        <v-icon size="18">mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ selectedLang[lang].table.action.deleteTooltip }}</span>
                  </v-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { DocumentAttachment, LanguageCollection } from '@/types';
import { isImageFile, getFileType, getFileIconName, getFileIconColor } from '@/utils/fileUtils';

interface Props {
  documentAttachment: DocumentAttachment[],
  thumb: boolean
  lang: string,
  cols: number,
  editPermission: boolean
  deletePermission: boolean,
  tableThumbColumn: boolean,
  tableFixedHeader: boolean,
  tableHeight: number,
  selectedLang: LanguageCollection
}

const props = withDefaults(defineProps<Props>(), {
  thumb: true,
  lang: "en",
  cols: 4,
  editPermission: true,
  deletePermission: true,
  tableFixedHeader: true,
  tableHeight: 400,
})

const emit = defineEmits(["openDeleteDialog", "openEditDocumentDialog"])

// Helper functions for safe file type checking
const safeIsImageFile = (fileName: string | undefined): boolean => {
  return fileName ? isImageFile(fileName) : false;
};

const safeGetFileType = (fileName: string | undefined): string => {
  return fileName ? getFileType(fileName) : 'file';
};

const safeGetFileExtension = (fileName: string | undefined): string => {
  return fileName ? fileName.split('.').pop()?.toLowerCase() || '' : '';
};

// Icon functions are now imported from @/utils/fileUtils

// Format file size
const formatFileSize = (bytes: number): string => {
  const kb = bytes / 1000;
  const mb = kb / 1024;
  
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  } else {
    return `${kb.toFixed(1)} KB`;
  }
};

// Get color for file size chip based on size
const getFileSizeColor = (bytes: number): string => {
  const mb = bytes / (1000 * 1024);
  
  if (mb < 1) return 'success';
  if (mb < 5) return 'warning';
  return 'error';
};

const openDeleteDialog = (index: number, deleteId: string) => {
  emit("openDeleteDialog", index, deleteId);
};

const openEditDocumentDialog = (item: any, index: number) => {
  emit("openEditDocumentDialog", item, index);
};
</script>

<style scoped>
.table-row:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-table {
  border-radius: 8px;
}

.v-table th {
  font-weight: 600;
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
