<template>
  <v-app>
    <v-main>
      <handy-uploader
        :documentAttachment.sync="registryDocFile"
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

<script>
import handyUploader from "./components/handyUploader";

export default {
  name: "App",

  components: {
    handyUploader
  },

  data: () => ({
    registryDocFile: [],
    customLang: {
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
    }
  }),
  methods: {}
};
</script>
