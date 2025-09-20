<template>
  <div>
    <template v-if="props.badgeCounter">
      <template v-if="props.documentAttachment.length > 0">
        <v-badge
          bordered
          :color="
            props.documentAttachment.length === props.maxFileCount ? 'error' : 'success'
          "
          overlap
          :content="documentAttachment.length"
        >
          <v-btn :color="props.btnColor" @click="openInputDocumentModal" class="mb-4">
            {{ props.selectedLang[lang].insertFile }}
          </v-btn>
        </v-badge>
      </template>
      <template v-else>
        <v-btn :color="props.btnColor" @click="openInputDocumentModal" class="mb-4">
          {{ props.selectedLang[lang].insertFile }}
        </v-btn>
      </template>
    </template>
    <template v-if="!props.badgeCounter">
      <v-btn :color="btnColor" @click="openInputDocumentModal" class="mb-4">
        {{ props.selectedLang[lang].insertFile }}
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
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
const openInputDocumentModal = () => {
  emit("openInputDocumentModal");
}
</script>
