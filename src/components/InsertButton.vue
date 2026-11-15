<template>
  <div>
    <template v-if="props.badgeCounter">
      <template v-if="props.documentAttachment.length > 0">
        <v-badge
          bordered
          :color="isFull ? 'error' : 'success'"
          overlap
          :content="documentAttachment.length"
        >
          <v-btn
            :color="props.btnColor"
            :disabled="isFull"
            @click="openInputDocumentModal"
            class="mb-4"
          >
            {{ props.selectedLang[lang].insertFile }}
          </v-btn>
        </v-badge>
      </template>
      <template v-else>
        <v-btn
          :color="props.btnColor"
          :disabled="isFull"
          @click="openInputDocumentModal"
          class="mb-4"
        >
          {{ props.selectedLang[lang].insertFile }}
        </v-btn>
      </template>
    </template>
    <template v-if="!props.badgeCounter">
      <v-btn :color="btnColor" :disabled="isFull" @click="openInputDocumentModal" class="mb-4">
        {{ props.selectedLang[lang].insertFile }}
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { DocumentAttachment, LanguageCollection } from '@/types';

interface Props {
  documentAttachment: DocumentAttachment[],
  badgeCounter: boolean,
  btnColor: string,
  lang: string,
  maxFileCount: number,
  selectedLang: LanguageCollection
}

const emit = defineEmits(["openInputDocumentModal"])

const props = defineProps<Props>();
// Like the framework-free version: no more files can be added once the limit is reached.
const isFull = computed(() => props.documentAttachment.length >= props.maxFileCount)
const openInputDocumentModal = () => {
  emit("openInputDocumentModal");
}
</script>
