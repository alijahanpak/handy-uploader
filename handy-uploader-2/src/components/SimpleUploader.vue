<template>
  <div>
    <v-row>
      <v-col
        v-for="(attachment, index) in documentAttachment"
        :key="`attachment-${index}`"
        cols="12"
        :md="cols"
        xs="12"
      >
        <v-card
          :shaped="shaped"
          :outlined="outlined"
          :raised="raised"
          :tile="tile"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-subtitle color="blue-grey darken-3">{{
                attachment.file.name
              }}</v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="Number((attachment.file.size / 1000).toFixed(1)) < 1024"
              >
                <v-chip color="teal lighten-2" label text-color="white">
                  {{
                    Number((attachment.file.size / 1000).toFixed(1)) +
                      "  " +
                      selectedLang[lang].size.kb
                  }}
                  <v-icon right>mdi-harddisk</v-icon>
                </v-chip>
              </v-list-item-subtitle>
              <v-list-item-subtitle
                v-if="Number((attachment.file.size / 1000).toFixed(1)) > 1024"
              >
                <v-chip color="teal lighten-2" label text-color="white">
                  {{
                    Number((attachment.file.size / 1000 / 1024).toFixed(1)) +
                      "  " +
                      selectedLang[lang].size.mb
                  }}
                  <v-icon right>mdi-harddisk</v-icon>
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar tile size="80" color="blue-grey lighten-5">
              <template
                v-if="
                  attachment.file.name
                    .split('.')
                    .pop()
                    .toLowerCase() === 'jpg' ||
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'jpeg' ||
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'png' ||
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'tif' ||
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'bmp'
                "
              >
                <v-img
                  v-if="thumb"
                  :src="
                    'data:' +
                      attachment.file.format +
                      ',' +
                      attachment.file.base64
                  "
                ></v-img>
                <v-icon
                  v-else
                  style="margin-left: 10px"
                  size="50"
                  file-word-outline
                  color="deep-purple darken-1"
                  >mdi-file-image-outline</v-icon
                >
              </template>
              <template v-else>
                <v-icon
                  v-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'pdf'
                  "
                  x-large
                  file-word-outline
                  color="red darken-1"
                  >mdi-file-pdf-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'doc' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'docx' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'odt'
                  "
                  x-large
                  file-word-outline
                  color="blue darken-1"
                  >mdi-file-word-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'jpg' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'jpeg' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'png' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'tif' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'bmp'
                  "
                  x-large
                  file-word-outline
                  color="deep-purple darken-1"
                  >mdi-file-image-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'xls' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'xlsx'
                  "
                  x-large
                  file-word-outline
                  color="teal darken-1"
                  >mdi-file-excel-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'pptx' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'pptm' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'ppt'
                  "
                  x-large
                  file-word-outline
                  color="orange darken-3"
                  >mdi-file-powerpoint-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'mp4' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'mov' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'flv' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'wmv' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'avi'
                  "
                  x-large
                  file-word-outline
                  color="red lighten-1"
                  >mdi-file-video-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'dwg'
                  "
                  x-large
                  file-word-outline
                  color="indigo lighten-2"
                  >mdi-file-cad</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'zip' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'rar' ||
                      attachment.file.name
                        .split('.')
                        .pop()
                        .toLowerCase() === '7-zip'
                  "
                  x-large
                  file-word-outline
                  color="lime lighten-1"
                  >mdi-folder-zip-outline</v-icon
                >
                <v-icon
                  v-else-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'txt'
                  "
                  x-large
                  file-word-outline
                  color="light-green darken-3"
                  >mdi-script-text-outline</v-icon
                >
                <v-icon
                  v-else
                  x-large
                  file-word-outline
                  color="indigo lighten-1"
                  >mdi-file-question-outline</v-icon
                >
              </template>
            </v-list-item-avatar>
          </v-list-item>
          <v-divider class="mx-4"></v-divider>
          <v-card-actions style="padding: 0">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="deletePermission"
                  text
                  fab
                  v-on="on"
                  @click="openDeleteDialog(index, '')"
                  ><v-icon color="red">mdi-trash-can-outline</v-icon></v-btn
                >
              </template>
              <span class="BYekan">{{ selectedLang[lang].delete }}</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="editPermission"
                  text
                  fab
                  v-on="on"
                  @click="openEditDocumentDialog(attachment, index)"
                  ><v-icon color="green">mdi-pencil-outline</v-icon></v-btn
                >
              </template>
              <span class="BYekan">{{ selectedLang[lang].edit }}</span>
            </v-tooltip>

            <v-spacer></v-spacer>

            <v-btn
              v-if="
                attachment.file.tags.length > 0 ||
                  attachment.file.description !== ''
              "
              icon
              @click.prevent="
                attachment.file.showDetailState = !attachment.file
                  .showDetailState
              "
            >
              <v-icon>{{
                attachment.file.showDetailState
                  ? "mdi-chevron-up"
                  : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <template
              v-if="
                attachment.file.tags.length > 0 ||
                  attachment.file.description !== ''
              "
            >
              <div v-show="attachment.file.showDetailState">
                <v-divider></v-divider>
                <v-chip-group
                  v-if="attachment.file.tags.length > 0"
                  multiple
                  active-class="primary--text"
                  style="padding: 8px"
                >
                  <v-chip
                    v-for="(tag, index) in attachment.file.tags"
                    :key="`attachment-${index}`"
                    style="margin: 5px"
                  >
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
                <v-card-text
                  v-if="attachment.file.description != null"
                  style="text-align: justify"
                >
                  {{ attachment.file.description }}
                </v-card-text>
              </div>
            </template>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    documentAttachment: [Array],
    thumb: {
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      default: "en"
    },
    cols: {
      type: Number,
      default: 4
    },
    editPermission: {
      type: Boolean,
      default: true
    },
    cardType: String,
    outlined: Boolean,
    raised: Boolean,
    shaped: Boolean,
    tile: Boolean,
    deletePermission: {
      type: Boolean,
      default: true
    },
    selectedLang: {}
  },
  data: () => ({}),
  methods: {
    setCardTheme() {
      this.$emit("setCardTheme");
    },
    openDeleteDialog(index, deleteId) {
      this.$emit("openDeleteDialog", index, deleteId);
    },
    openEditDocumentDialog(item, index) {
      this.$emit("openEditDocumentDialog", item, index);
    }
  }
};
</script>
