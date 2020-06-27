<template>
  <v-app>
    <v-main>
      <handy-uploader
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
    registryDocFile: []
  }),
  methods: {
    setInsertedFile(item) {
      this.registryDocFile = item;
    }
  }
};
</script>
