<template>
  <div>
    <v-row>
      <v-col
        v-for="(attachment, index) in documentAttachment"
        :key="`attachment-${index}`"
        cols="12"
        md="4"
        xs="12"
      >
        <v-card
          :shaped="shaped"
          :outlined="outlined"
          :raised="raised"
          :tile="tile"
          class="mx-auto"
          max-width="344"
        >
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
              :src="
                'data:' + attachment.file.format + ',' + attachment.file.base64
              "
              height="200px"
            ></v-img>
          </template>
          <template v-else>
            <v-list-item-avatar
              style="margin-top: 0"
              tile
              width="345"
              height="192"
              color="blue-grey lighten-5"
            >
              <template>
                <v-icon
                  v-if="
                    attachment.file.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'pdf'
                  "
                  size="120"
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
                  size="120"
                  file-word-outline
                  color="blue darken-1"
                  >mdi-file-word-outline</v-icon
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
                  size="120"
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
                  size="120"
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
                  size="120"
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
                  size="120"
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
                  size="120"
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
                  size="120"
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
          </template>

          <v-card-subtitle style="height: 70px">
            {{ attachment.file.name }}
          </v-card-subtitle>
          <v-card-subtitle
            v-if="Number((attachment.file.size / 1000).toFixed(1)) < 1024"
            class="mt2"
          >
            <v-chip color="teal lighten-2" label text-color="white">
              {{
                Number((attachment.file.size / 1000).toFixed(1)) +
                  "  " +
                  selectedLang[lang].size.kb
              }}
              <v-icon right>mdi-harddisk</v-icon>
            </v-chip>
          </v-card-subtitle>
          <v-card-subtitle
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
          </v-card-subtitle>
          <v-divider class="mx-4"></v-divider>
          <v-spacer></v-spacer>
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
