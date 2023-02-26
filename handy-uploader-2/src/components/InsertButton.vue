<template>
  <div>
    <template v-if="badgeCounter">
      <template v-if="documentAttachment.length > 0">
        <v-badge
          bordered
          :color="
            documentAttachment.length === maxFileCount ? 'error' : 'success'
          "
          overlap
          :content="documentAttachment.length"
        >
          <v-btn :color="btnColor" @click="openInputDocumentModal" class="mb-4">
            {{ selectedLang[lang].insertFile }}
          </v-btn>
        </v-badge>
      </template>
      <template v-else>
        <v-btn :color="btnColor" @click="openInputDocumentModal" class="mb-4">
          {{ selectedLang[lang].insertFile }}
        </v-btn>
      </template>
    </template>
    <template v-if="!badgeCounter">
      <v-btn :color="btnColor" @click="openInputDocumentModal" class="mb-4">
        {{ selectedLang[lang].insertFile }}
      </v-btn>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    documentAttachment: [Array],
    badgeCounter: {
      type: Boolean,
      default: true
    },
    btnColor: {
      type: String,
      default: "info"
    },
    lang: {
      type: String,
      default: "en"
    },
    maxFileCount: {
      type: Number,
      default: 0
    },
    selectedLang: {}
  },
  data: () => ({}),
  methods: {
    openInputDocumentModal() {
      this.$emit("openInputDocumentModal");
    }
  }
};
</script>
