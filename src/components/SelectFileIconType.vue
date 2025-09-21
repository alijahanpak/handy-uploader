<template>
  <div>
    <v-icon
      :size="props.size"
      :color="fileTypeData.color"
    >
      {{ fileTypeData.icon }}
    </v-icon>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  fileFormat: string;
  size: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 30,
});

const fileTypeData = computed(() => {
  const fileMappings: { [key: string]: { icon: string; color: string } } = {
    pdf: { icon: "mdi-file-pdf-outline", color: "red darken-1" },
    doc: { icon: "mdi-file-word-outline", color: "blue darken-1" },
    docx: { icon: "mdi-file-word-outline", color: "blue darken-1" },
    odt: { icon: "mdi-file-word-outline", color: "blue darken-1" },
    jpg: { icon: "mdi-file-image-outline", color: "deep-purple darken-1" },
    jpeg: { icon: "mdi-file-image-outline", color: "deep-purple darken-1" },
    png: { icon: "mdi-file-image-outline", color: "deep-purple darken-1" },
    tif: { icon: "mdi-file-image-outline", color: "deep-purple darken-1" },
    bmp: { icon: "mdi-file-image-outline", color: "deep-purple darken-1" },
    xls: { icon: "mdi-file-excel-outline", color: "teal darken-1" },
    xlsx: { icon: "mdi-file-excel-outline", color: "teal darken-1" },
    ppt: { icon: "mdi-file-powerpoint-outline", color: "orange darken-3" },
    pptx: { icon: "mdi-file-powerpoint-outline", color: "orange darken-3" },
    pptm: { icon: "mdi-file-powerpoint-outline", color: "orange darken-3" },
    mp4: { icon: "mdi-file-video-outline", color: "red lighten-1" },
    mov: { icon: "mdi-file-video-outline", color: "red lighten-1" },
    flv: { icon: "mdi-file-video-outline", color: "red lighten-1" },
    wmv: { icon: "mdi-file-video-outline", color: "red lighten-1" },
    avi: { icon: "mdi-file-video-outline", color: "red lighten-1" },
    dwg: { icon: "mdi-file-cad", color: "indigo lighten-2" },
    zip: { icon: "mdi-folder-zip-outline", color: "lime lighten-1" },
    rar: { icon: "mdi-folder-zip-outline", color: "lime lighten-1" },
    '7-zip': { icon: "mdi-folder-zip-outline", color: "lime lighten-1" },
    txt: { icon: "mdi-script-text-outline", color: "light-green darken-3" },
  };

  return fileMappings[props.fileFormat] || {
    icon: "mdi-file-question-outline",
    color: "indigo lighten-1",
  };
});
</script>
