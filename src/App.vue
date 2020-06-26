<template>
  <v-app>
    <v-main>
      <file-uploader
        :setDocumentAttachment="setInsertedFile"
        :documentAttachment.sync="registryDocFile"
        :fileUploaderType="'thumbnail'"
        :maxFileSize="10240"
        :imageCompressor="true"
        :imageCompressLevel="0.8"
        :maxFileCount="10"
        :badgeCounter="true"
        ref="fileUploader"
      >
      </file-uploader>
    </v-main>
  </v-app>
</template>

<script>
import fileUploader from "./components/vueFileUploader";

export default {
  name: "App",

  components: {
    fileUploader
  },

  data: () => ({
    registryDocFile: []
  }),
  methods: {
    setInsertedFile(item) {
      this.registryDocFile = item;
    }
  }
};
</script>
