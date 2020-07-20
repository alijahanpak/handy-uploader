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
        :tags= "['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4']"
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
  }
};
</script>
