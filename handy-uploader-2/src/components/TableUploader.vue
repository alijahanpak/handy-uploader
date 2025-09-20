<template>
  <div>
    <v-row>
      <v-col cols="12" lg="12" md="12" xs="12">
        <v-simple-table
          :fixed-header="props.tableFixedHeader"
          :height="props.tableHeight + 'px'"
        >
          <template v-slot:default>
            <thead>
              <tr>
                <th v-if="props.tableThumbColumn" class="text-left">
                  {{ props.selectedLang[lang].table.thumb }}
                </th>
                <th class="text-left">{{ props.selectedLang[lang].table.name }}</th>
                <th class="text-left">{{ props.selectedLang[lang].table.size }}</th>
                <th class="text-left">
                  {{ props.selectedLang[lang].table.action.action }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(attachment, index) in props.documentAttachment"
                :key="`attachment-${index}`"
              >
                <td v-if="props.tableThumbColumn">
                  <template
                    v-if="
                      attachment.file.name && 
                      ['jpg', 'jpeg', 'png', 'tif', 'bmp'].includes(
                        attachment.file.name.split('.').pop()?.toLowerCase() || ''
                      )
                    "
                  >
                    <v-img
                      v-if="props.thumb"
                      style="margin: 10px"
                      :src="
                        'data:' +
                          attachment.file.format +
                          ',' +
                          attachment.file.base64
                      "
                      height="50px"
                      width="50px"
                    ></v-img>
                    <v-icon
                      v-else
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="deep-purple darken-1"
                      >mdi-file-image-outline</v-icon
                    >
                  </template>
                  <template v-else>
                    <v-icon
                      v-if="safeGetFileExtension(attachment.file.name) === 'pdf'"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="red darken-1"
                      >mdi-file-pdf-outline</v-icon
                    >
                    <v-icon
                      v-else-if="['doc', 'docx', 'odt'].includes(safeGetFileExtension(attachment.file.name))"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="blue darken-1"
                      >mdi-file-word-outline</v-icon
                    >
                    <v-icon
                      v-else-if="['xls', 'xlsx'].includes(safeGetFileExtension(attachment.file.name))"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="teal darken-1"
                      >mdi-file-excel-outline</v-icon
                    >
                    <v-icon
                      v-else-if="['pptx', 'pptm', 'ppt'].includes(safeGetFileExtension(attachment.file.name))"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="orange darken-3"
                      >mdi-file-powerpoint-outline</v-icon
                    >
                    <v-icon
                      v-else-if="['mp4', 'mov', 'flv', 'wmv', 'avi'].includes(safeGetFileExtension(attachment.file.name))"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="red lighten-1"
                      >mdi-file-video-outline</v-icon
                    >
                    <v-icon
                      v-else-if="safeGetFileExtension(attachment.file.name) === 'dwg'"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="indigo lighten-2"
                      >mdi-file-cad</v-icon
                    >
                    <v-icon
                      v-else-if="['zip', 'rar', '7-zip'].includes(safeGetFileExtension(attachment.file.name))"
                      size="120"
                      file-word-outline
                      color="lime lighten-1"
                      >mdi-folder-zip-outline</v-icon
                    >
                    <v-icon
                      v-else-if="safeGetFileExtension(attachment.file.name) === 'txt'"
                      style="margin-left: 10px"
                      size="50"
                      file-word-outline
                      color="light-green darken-3"
                      >mdi-script-text-outline</v-icon
                    >
                    <v-icon
                      v-else
                      x-large
                      file-word-outline
                      color="indigo lighten-1"
                      >mdi-file-question-outline</v-icon
                    >
                  </template>
                </td>
                <td>{{ attachment.file.name }}</td>
                <td>
                  <v-card-subtitle
                    v-if="
                      Number((attachment.file.size / 1000).toFixed(1)) < 1024
                    "
                    class="mt2"
                  >
                    <v-chip color="teal lighten-2" label text-color="white">
                      {{
                        Number((attachment.file.size / 1000).toFixed(1)) +
                          selectedLang[lang].size.kb
                      }}
                      <v-icon right>mdi-harddisk</v-icon>
                    </v-chip>
                  </v-card-subtitle>
                  <v-card-subtitle
                    v-if="
                      Number((attachment.file.size / 1000).toFixed(1)) > 1024
                    "
                  >
                    <v-chip color="teal lighten-2" label text-color="white">
                      {{
                        Number(
                          (attachment.file.size / 1000 / 1024).toFixed(1)
                        ) + selectedLang[lang].size.mb
                      }}
                      <v-icon right>mdi-harddisk</v-icon>
                    </v-chip>
                  </v-card-subtitle>
                </td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="deletePermission"
                        icon
                        color="red"
                        v-bind="props"
                        @click="openDeleteDialog(index, '')"
                        ><v-icon>mdi-delete</v-icon></v-btn
                      >
                    </template>
                    <span>{{
                      selectedLang[lang].table.action.deleteTooltip
                    }}</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="editPermission"
                        text
                        fab
                        v-bind="props"
                        @click="openEditDocumentDialog(attachment, index)"
                        ><v-icon color="green"
                          >mdi-pencil-outline</v-icon
                        ></v-btn
                      >
                    </template>
                    <span class="BYekan">{{ selectedLang[lang].edit }}</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { DocumentAttachment, LanguageCollection } from '@/types';
import { getFileIcon, isImageFile, getFileType } from '@/utils/fileUtils';

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

const openDeleteDialog = (index: number, deleteId: string) => {
  emit("openDeleteDialog", index, deleteId);
};
const openEditDocumentDialog = (item: any, index: number) => {
  emit("openEditDocumentDialog", item, index);
};
</script>
