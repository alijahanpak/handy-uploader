<template>
  <v-app>
    <v-main>
      <handy-uploader
        :documentAttachment="registryDocFile"
        :fileUploaderType="'thumbnail'"
        :maxFileSize="10240"
        :imageCompressor="true"
        :imageCompressLevel="0.8"
        :maxFileCount="10"
        :badgeCounter="true"
        :changeFileName="true"
        :addFileDescription="true"
        :addFileTag="true"
        :lang="'en'"
        :tags="['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4']"
      >
      </handy-uploader>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import handyUploader from './components/handyUploader.vue'

interface Language {
  custom: {
        insertFile: string,
        insertNewFile: string,
        add: string,
        delete: string,
        deleteDialog: {
          message: string,
          cancel: string,
        },
        table: {
          thumb: string,
          name: string,
          size: string,
          tags: string,
          action: {
            action: string,
            deleteTooltip: string
          }
        },
        size: {
          kb: string,
          mb: string
        },
        maxFileSizeAlert: string,
        maxFileCountAlert: string,
        fileName: string,
        fileDescription: string,
        fileTags: string
      }
}

const registryDocFile = reactive([])
const customLang: Language = reactive({
  custom: {
      insertFile: "Insert File1",
      insertNewFile: "Insert New File1",
      add: "Add",
      delete: "Delete",
      deleteDialog: {
        message: "Are you sure you want to delete the file?",
        cancel: "cancel"
      },
      table: {
        thumb: "Thumb",
        name: "Name",
        size: "Size",
        tags: "tags",
        action: {
          action: "Action",
          deleteTooltip: "Delete"
        }
      },
      size: {
        kb: "KB",
        mb: "MB"
      },
      maxFileSizeAlert: "Max file Size is",
      maxFileCountAlert: "Max file Count is",
      fileName: "File Name",
      fileDescription: "File Description",
      fileTags: "File Tags"
    }
})
</script>
