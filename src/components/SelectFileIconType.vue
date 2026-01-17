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
import { getDetailedFileIcon } from '@/utils/fileUtils';

interface Props {
  fileFormat: string;
  size: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 30,
});

const fileTypeData = computed(() => {
  // Create a fake filename with the format as extension to use the utility function
  const fakeFileName = `file.${props.fileFormat}`;
  return getDetailedFileIcon(fakeFileName);
});
</script>
