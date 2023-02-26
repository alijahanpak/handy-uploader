<template>
  <div>
    <v-icon
      v-if="format === 'pdf'"
      :size="size"
      file-word-outline
      color="red darken-1"
      >mdi-file-pdf-outline</v-icon
    >
    <v-icon
      v-else-if="
        fileFormat === 'doc' || fileFormat === 'docx' || fileFormat === 'odt'
      "
      :size="size"
      file-word-outline
      color="blue darken-1"
      >mdi-file-word-outline</v-icon
    >
    <v-icon
      v-else-if="
        fileFormat === 'jpg' ||
          fileFormat === 'jpeg' ||
          fileFormat === 'png' ||
          fileFormat === 'tif' ||
          fileFormat === 'bmp'
      "
      :size="size"
      file-word-outline
      color="deep-purple darken-1"
      >mdi-file-image-outline</v-icon
    >
    <v-icon
      v-else-if="fileFormat === 'xls' || fileFormat === 'xlsx'"
      :size="size"
      file-word-outline
      color="teal darken-1"
      >mdi-file-excel-outline</v-icon
    >
    <v-icon
      v-else-if="
        fileFormat === 'pptx' || fileFormat === 'pptm' || fileFormat === 'ppt'
      "
      :size="size"
      file-word-outline
      color="orange darken-3"
      >mdi-file-powerpoint-outline</v-icon
    >
    <v-icon
      v-else-if="
        fileFormat === 'mp4' ||
          fileFormat === 'mov' ||
          fileFormat === 'flv' ||
          fileFormat === 'wmv' ||
          fileFormat === 'avi'
      "
      :size="size"
      file-word-outline
      color="red lighten-1"
      >mdi-file-video-outline</v-icon
    >
    <v-icon
      v-else-if="fileFormat === 'dwg'"
      :size="size"
      file-word-outline
      color="indigo lighten-2"
      >mdi-file-cad</v-icon
    >
    <v-icon
      v-else-if="
        fileFormat === 'zip' || fileFormat === 'rar' || fileFormat === '7-zip'
      "
      :size="size"
      file-word-outline
      color="lime lighten-1"
      >mdi-folder-zip-outline</v-icon
    >
    <v-icon
      v-else-if="fileFormat === 'txt'"
      :size="size"
      file-word-outline
      color="light-green darken-3"
      >mdi-script-text-outline</v-icon
    >
    <v-icon v-else :size="size" file-word-outline color="indigo lighten-1"
      >mdi-file-question-outline</v-icon
    >
  </div>
</template>

<script>
export default {
  props: {
    fileFormat: {
      type: String,
      default: ""
    },
    size: {
      type: Number,
      default: 30
    }
  }
};
</script>
