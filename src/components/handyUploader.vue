<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" xs="12">
        <InsertButton
          :documentAttachment="documentAttachment"
          :selectedLang="selectedLang"
          :lang="lang"
          :badgeCounter="badgeCounter"
          :btnColor="btnColor"
          :maxFileCount="maxFileCount"
          @openInputDocumentModal="openInputDocumentModal"
        >
        </InsertButton>
        <SimpleUploader
          v-if="fileUploaderType === 'simple'"
          :documentAttachment="documentAttachment"
          :cols="cols"
          :thumb="thumb"
          :outlined="outlined"
          :raised="raised"
          :shaped="shaped"
          :tile="tile"
          :lang="lang"
          :cardType="cardType"
          :deletePermission="deletePermission"
          :editPermission="editPermission"
          :selectedLang="selectedLang"
          @setCardTheme="setCardTheme"
          @openDeleteDialog="openDeleteDialog"
          @openEditDocumentDialog="openEditDocumentDialog"
        >
        </SimpleUploader>
        <ThumbnailUploader
          v-if="fileUploaderType === 'thumbnail'"
          :documentAttachment="documentAttachment"
          :cols="cols"
          :thumb="thumb"
          :outlined="outlined"
          :raised="raised"
          :shaped="shaped"
          :tile="tile"
          :lang="lang"
          :cardType="cardType"
          :deletePermission="deletePermission"
          :editPermission="editPermission"
          :selectedLang="selectedLang"
          @setCardTheme="setCardTheme"
          @openDeleteDialog="openDeleteDialog"
          @openEditDocumentDialog="openEditDocumentDialog"
        >
        </ThumbnailUploader>
        <TableUploader
          v-if="fileUploaderType === 'table'"
          :documentAttachment="documentAttachment"
          :cols="cols"
          :thumb="thumb"
          :outlined="outlined"
          :raised="raised"
          :shaped="shaped"
          :tile="tile"
          :lang="lang"
          :tableThumbColumn="tableThumbColumn"
          :tableFixedHeader="tableFixedHeader"
          :tableHeight="tableHeight"
          :cardType="cardType"
          :deletePermission="deletePermission"
          :editPermission="editPermission"
          :selectedLang="selectedLang"
          @setCardTheme="setCardTheme"
          @openDeleteDialog="openDeleteDialog"
          @openEditDocumentDialog="openEditDocumentDialog"
        >
        </TableUploader>
      </v-col>
    </v-row>
    <!--Insert New Document Dialog Start-->
    <v-row justify="center">
      <v-dialog
        v-model="insertDocumentDialog"
        :scrollable="false"
        persistent
        width="50%"
      >
        <v-card>
          <v-card-title>
            <v-icon @click="insertDocumentDialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="BYekan">
            <template v-if="tempAttachment.length === 0">
              <v-file-input
                v-if="fileAccept !== ''"
                multiple
                :accept="fileAccept"
                chip
                v-model="tempAttachment"
                :label="selectedLang[lang].insertNewFile"
              ></v-file-input>
              <v-file-input
                v-else
                multiple
                v-model="tempAttachment"
                :label="selectedLang[lang].insertNewFile"
              ></v-file-input>
            </template>
            <template>
              <v-expansion-panels
                v-if="addFileTag || addFileDescription || changeFileName"
              >
                <v-expansion-panel
                  v-for="(attachment, index) in tempAttachmentChanged"
                  :key="`attachment-${index}`"
                >
                  <v-expansion-panel-header>{{
                    attachment.name
                  }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row align="center" justify="center">
                      <v-col cols="12" lg="9" md="9" xs="12">
                        <v-text-field
                          v-if="changeFileName"
                          :label="selectedLang[lang].fileName"
                          v-model="attachment.name"
                          :prepend-icon="attachment.icon"
                        >
                        </v-text-field>
                        <v-textarea
                          v-if="addFileDescription"
                          :label="selectedLang[lang].fileDescription"
                          auto-grow
                          row-height="1"
                          v-model="attachment.description"
                        >
                        </v-textarea>
                        <v-autocomplete
                          v-if="addFileTag"
                          v-model="attachment.tags"
                          :items="tags"
                          dense
                          chips
                          :label="selectedLang[lang].fileTags"
                          multiple
                        ></v-autocomplete>
                      </v-col>
                      <v-col align="center" cols="12" lg="3" md="3" xs="12">
                        <template
                          v-if="
                            attachment.format === 'jpg' ||
                              attachment.format === 'jpeg' ||
                              attachment.format === 'png' ||
                              attachment.format === 'tif' ||
                              attachment.format === 'bmp'
                          "
                        >
                          <v-card>
                            <v-img :src="attachment.base64"></v-img>
                          </v-card>
                        </template>
                        <template v-else>
                          <select-file-icon-type
                            :file-format="attachment.format"
                            :size="60"
                          >
                          </select-file-icon-type>
                        </template>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-card v-else class="mx-auto" tile>
                <v-list-item
                  v-for="(attachment, index) in tempAttachmentChanged"
                  :key="`attachment-${index}`"
                  style="border-bottom: 1px solid #E0E0E0"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      <select-file-icon-type :file-format="attachment.format">
                      </select-file-icon-type>
                      {{ attachment.name }}.{{ attachment.format }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="BYekan"
              :disabled="tempAttachment == null || btnLoader"
              :loading="btnLoader"
              :color="btnColor"
              @click="uploadFieldChange"
              >{{ selectedLang[lang].add }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Insert New Document Dialog End-------------------------------------------------------------------->
    <!--Update Document Dialog Start---------------------------------------------------------------------->
    <v-row justify="center">
      <v-dialog
        v-model="editDocumentDialog"
        :scrollable="false"
        persistent
        width="50%"
      >
        <v-card>
          <v-card-title>
            <v-icon @click="editDocumentDialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text
            v-for="(attachment, index) in tempAttachmentChanged"
            :key="`attachment-${index}`"
            class="BYekan"
          >
            <v-row align="center" justify="center">
              <v-col cols="12" lg="9" md="9" xs="12">
                <v-text-field
                  v-if="changeFileName"
                  :label="selectedLang[lang].fileName"
                  v-model="attachment.name"
                  :prepend-icon="attachment.icon"
                >
                </v-text-field>
                <v-textarea
                  v-if="addFileDescription"
                  :label="selectedLang[lang].fileDescription"
                  auto-grow
                  row-height="1"
                  v-model="attachment.description"
                >
                </v-textarea>
                <v-autocomplete
                  v-if="addFileTag"
                  v-model="attachment.tags"
                  :items="tags"
                  dense
                  chips
                  :label="selectedLang[lang].fileTags"
                  multiple
                ></v-autocomplete>
              </v-col>
              <v-col align="center" cols="12" lg="3" md="3" xs="12">
                <template
                  v-if="
                    attachment.name
                      .split('.')
                      .pop()
                      .toLowerCase() === 'jpg' ||
                      attachment.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'jpeg' ||
                      attachment.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'png' ||
                      attachment.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'tif' ||
                      attachment.name
                        .split('.')
                        .pop()
                        .toLowerCase() === 'bmp'
                  "
                >
                  <v-card>
                    <v-img
                      :src="
                        'data:' + attachment.format + ',' + attachment.base64
                      "
                    ></v-img>
                  </v-card>
                </template>
                <template v-else>
                  <select-file-icon-type
                    :file-format="attachment.format"
                    :size="60"
                  >
                  </select-file-icon-type>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="BYekan"
              :disabled="tempAttachment === null || btnLoader"
              :loading="btnLoader"
              :color="btnColor"
              @click="editDocument"
              >{{ selectedLang[lang].edit }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Update Document Dialog End------------------------------------------------------------------------>

    <!--File Uploader SnackBar Alert Start --------------------------------------------------------------->
    <v-snackbar
      class="BYekan"
      v-model="fileUploaderSnackBarAlert"
      right
      bottom
      :color="fileUploaderSnackBarAlertColor"
      :timeout="3000"
    >
      {{ fileUploaderSnackText }}
      <v-btn color="white" text @click="fileUploaderSnackBarAlert = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <!--File Uploader SnackBar Alert Start -->
    <!--DELETE Dialog End----------------------------------------------------------START---->
    <v-row justify="center">
      <v-dialog v-model="deleteDocumentDialog" persistent width="30%">
        <v-card>
          <v-card-title>
            <v-icon color="red"></v-icon>
          </v-card-title>
          <v-card-text class="BYekan">
            {{ selectedLang[lang].deleteDialog.message }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="BYekan"
              color="green darken-1"
              text
              @click="deleteDocumentDialog = false"
              >{{ selectedLang[lang].deleteDialog.cancel }}</v-btn
            >
            <v-btn
              class="BYekan"
              color="primary"
              :disabled="btnLoader"
              :loading="btnLoader"
              @click="deleteDocument"
              >{{ selectedLang[lang].delete }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--DELETE Dialog End----------------------------------------------------------------END---->
  </v-container>
</template>

<script>
/**
 * This is an example of uploading files. with this component you can see, insert, delete files.
 * @version 1.0
 * @author [ali jahanpak](https://github.com/alijahanpak)
 * @since Version 1.0
 */
import InsertButton from "@/components/InsertButton.vue";
import SimpleUploader from "@/components/SimpleUploader.vue";
import ThumbnailUploader from "@/components/ThumbnailUploader.vue";
import TableUploader from "@/components/TableUploader.vue";
import SelectFileIconType from "@/components/SelectFileIconType.vue";
import languages from "./language";
export default {
  components: {
    InsertButton,
    SimpleUploader,
    ThumbnailUploader,
    TableUploader,
    SelectFileIconType
  },
  props: {
    /**
     * Array contain files
     */
    documentAttachment: [Array],
    /**
     * Send api url for 'add' and 'delete'.
     * f.e: /building/add or /building/delete
     */
    maxFileSize: {
      type: Number,
      default: 5120
    },
    /**
     * choose File Uploader Type
     */
    fileUploaderType: {
      type: String,
      default: "thumbnail"
    },
    /**
     * Maximum file Upload
     */
    maxFileCount: {
      type: Number,
      default: 0
    },
    /**
     * choose File Uploader Card Type
     */
    cardType: String,
    /**
     * Badge file counter state
     */
    badgeCounter: {
      type: Boolean,
      default: true
    },
    /**
     * change Button Color
     */
    btnColor: {
      type: String,
      default: "info"
    },
    /**
     * Enable / Disable image compressor
     */
    imageCompressor: Boolean,
    /**
     * Image compress level (0 to 1)
     */
    imageCompressLevel: {
      type: Number,
      default: 0.5
    },
    /**
     * Accept uploaded files
     */
    fileAccept: String,
    /**
     * show / hidden thumb for images in table and simple file uploader
     */
    thumb: {
      type: Boolean,
      default: true
    },
    /**
     * show / hidden thumb column in table file uploader
     */
    tableThumbColumn: Boolean,
    /**
     * enable / disable table fixed header
     */
    tableFixedHeader: {
      type: Boolean,
      default: true
    },
    /**
     * set table height
     */
    tableHeight: {
      type: Number,
      default: 400
    },
    /**
     * Enable RTL support languages
     */
    rtlSupport: {
      type: Boolean,
      default: false
    },
    /**
     * Change file uploader languages
     */
    lang: {
      type: String,
      default: "en"
    },
    /**
     * Change file Name before upload
     */
    changeFileName: {
      type: Boolean,
      default: false
    },
    /**
     * Add file Description before upload
     */
    addFileDescription: {
      type: Boolean,
      default: false
    },
    /**
     * Add file tags before upload
     */
    addFileTag: {
      type: Boolean,
      default: false
    },
    /**
     * Array of file tags
     */
    tags: {
      type: Array
    },
    /**
     * Change count of columns
     */
    cols: {
      type: Number,
      default: 4
    },
    /**
     * Define Custom language for uploader
     */
    customLang: {
      type: Object,
      default: null
    },
    /**
     * Set Insert/Add new file Permission
     */
    insertPermission: {
      type: Boolean,
      default: true
    },
    /**
     * Set edit Permission
     */
    editPermission: {
      type: Boolean,
      default: true
    },
    /**
     * Set delete Permission
     */
    deletePermission: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    insertDocumentDialog: false,
    editDocumentDialog: false,
    deleteDocumentDialog: false,
    tempAttachment: [],
    tempAttachmentChanged: [],
    fileUploaderSnackBarAlert: false,
    fileUploaderSnackText: "",
    fileUploaderSnackBarAlertColor: "green",
    readerFile: null,
    registryDocFile: [],
    documentAttachmentAPI: [],
    btnLoader: false,
    showDetail: false,
    showDetailState: [],
    selectedIndex: "",
    selectedId: "",
    returnedRecord: {},
    //Card Theme
    outlined: false,
    raised: false,
    shaped: false,
    tile: false,
    selectedLang: {},
    beforeInsertAttachments: {},
    attachmentIndex: ""
  }),
  watch: {
    tempAttachment: function(newValue) {
      if (this.tempAttachment.length > 0) this.getAttachmentDetails(newValue);
      else this.tempAttachmentChanged = [];
    },
    cardType: function() {
      this.$emit("update:cardType", this.cardType);
      this.setCardTheme();
    },
    badgeCounter: function() {
      this.$emit("update:badgeCounter", this.badgeCounter);
    },
    maxFileCount: function() {
      this.$emit("update:maxFileCount", this.maxFileCount);
    },
    maxFileSize: function() {
      this.$emit("update:maxFileSize", Number(this.maxFileSize));
    },
    imageCompressor: function() {
      this.$emit("update:imageCompressor", this.imageCompressor);
    },
    imageCompressLevel: function() {
      this.$emit("update:imageCompressLevel", this.imageCompressLevel);
    },
    fileAccept: function() {
      this.$emit("update:fileAccept", this.fileAccept);
    },
    thumb: function() {
      this.$emit("update:thumb", this.thumb);
    },
    changeFileName: function() {
      this.$emit("update:changeFileName", this.changeFileName);
    },
    addFileDescription: function() {
      this.$emit("update:addFileDescription", this.addFileDescription);
    },
    addFileTag: function() {
      this.$emit("update:addFileTag", this.addFileTag);
    },
    tableThumbColumn: function() {
      this.$emit("update:tableThumbColumn", this.tableThumbColumn);
    },
    tableFixedHeader: function() {
      this.$emit("update:tableFixedHeader", this.tableFixedHeader);
    },
    tableHeight: function() {
      this.$emit("update:tableHeight", this.tableHeight);
    },
    lang: function() {
      this.$emit("update:lang", this.lang);
    }
  },
  created() {
    if (this.rtlSupport) this.changeRTL();
    this.setLang();
    this.setCardTheme();
  },
  destroyed() {
    this.registryDocFile = [];
  },
  methods: {
    openInputDocumentModal() {
      this.btnLoader = false;
      this.tempAttachment = [];
      this.insertDocumentDialog = true;
    },

    setLang() {
      if (this.customLang !== null) this.selectedLang = this.customLang;
      else this.selectedLang = languages;
    },
    changeRTL() {
      this.$vuetify.rtl = true;
    },
    setCardTheme() {
      switch (this.cardType) {
        case "default":
          this.outlined = false;
          this.raised = false;
          this.shaped = false;
          this.tile = false;
          break;
        case "outlined":
          this.outlined = true;
          this.raised = false;
          this.shaped = false;
          this.tile = false;
          break;
        case "shaped":
          this.shaped = true;
          this.raised = false;
          this.outlined = false;
          this.tile = false;
          break;
        case "raised":
          this.raised = true;
          this.shaped = false;
          this.outlined = false;
          this.tile = false;
          break;
        case "tile":
          this.tile = true;
          this.shaped = false;
          this.outlined = false;
          this.raised = false;
          break;
      }
    },

    handleUpload(fileAttachment) {
      let reader = new FileReader();
      return new Promise(function(resolve) {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(fileAttachment);
      });
    },

    /**
     * asynchronous method to insert selected file(s)
     *
     * @public
     * @returns {Array} selected file(s)
     */
    async uploadFieldChange() {
      this.btnLoader = true;
      for (let [index, item] of this.tempAttachment.entries()) {
        if (this.documentAttachment.length < this.maxFileCount) {
          if ((item.size / 1000).toFixed(1) > this.maxFileSize) {
            this.fileUploaderSnackBarAlertColor = "red";
            this.fileUploaderSnackText = `${
              this.selectedLang[this.lang].maxFileSizeAlert
            } ${Math.round(this.maxFileSize / 1024)} ${
              this.selectedLang[this.lang].size.mb
            }`;
            this.fileUploaderSnackBarAlert = true;
          } else {
            let tempFile = {};
            let file = {};
            try {
              console.log(item);
              this.readerFile = await this.handleUpload(item);
            } catch (e) {
              console.log(e);
            }
            let fullFileType = this.readerFile.split(";");
            let fileType = fullFileType[0].split(":");
            let status = false;
            let imgFile = "";
            let sizeInKb = 0;
            if (this.imageCompressor) {
              if (
                fileType[1] === "image/png" ||
                fileType[1] === "image/jpg" ||
                fileType[1] === "image/jpeg" ||
                fileType[1] === "application/octet-stream" ||
                fileType[1] === "image/webp"
              ) {
                status = true;
                imgFile = await this.compressImage(
                  this.readerFile,
                  fileType[1]
                );
              }
            }
            //tempFile.subject= this.tempAttachmentChanged[index].name + '.' + this.tempAttachmentChanged[index].format;
            let strTemp = this.readerFile.split(",");
            if (status) {
              let imgTemp = imgFile.split(",");
              tempFile.base64 = imgTemp[1];
              sizeInKb = new Buffer(imgFile, "base64").length;
              tempFile.size = String(sizeInKb);
            } else {
              tempFile.base64 = strTemp[1];
              tempFile.size = String(item.size);
            }
            tempFile.name =
              this.tempAttachmentChanged[index].name +
              "." +
              this.tempAttachmentChanged[index].format;
            if (this.tempAttachmentChanged[index].tags === undefined)
              tempFile.tags = [];
            else tempFile.tags = this.tempAttachmentChanged[index].tags;
            if (this.tempAttachmentChanged[index].description === undefined)
              tempFile.description = "";
            else
              tempFile.description = this.tempAttachmentChanged[
                index
              ].description;
            tempFile.showDetailState = false;

            tempFile.format = strTemp[0].replace("data:", "");
            file.file = tempFile;
            /* const convertedToFile = this.convertBase64ToFile(
              imgFile,
              tempFile.name
            ); */
            // console.log(convertedToFile)
            this.registryDocFile.push(file);
            this.$emit("update:documentAttachment", this.registryDocFile);
          }
        } else {
          this.fileUploaderSnackBarAlertColor = "red";
          this.fileUploaderSnackText = `${
            this.selectedLang[this.lang].maxFileCountAlert
          } ${this.maxFileCount}`;
          this.fileUploaderSnackBarAlert = true;
        }
      }
      this.documentAttachmentAPI = [];
      this.tempAttachmentChanged = [];
      this.insertDocumentDialog = false;
    },

    compressImage(base64) {
      const canvas = document.createElement("canvas");
      const img = document.createElement("img");

      return new Promise((resolve, reject) => {
        let imageCompressLevelTemp = this.imageCompressLevel;
        img.onload = function() {
          let width = img.width;
          let height = img.height;
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", imageCompressLevelTemp));
        };
        img.onerror = function(err) {
          reject(err);
        };
        img.src = base64;
      });
    },

    convertBase64ToFile(base64, fileName) {
      const byteString = atob(base64.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const newBlob = new Blob([ab], {
        type: "image/jpeg"
      });
      return new File([newBlob], fileName);
    },

    openDeleteDialog(index, deleteId) {
      this.btnLoader = false;
      this.selectedIndex = index;
      this.selectedId = deleteId;
      this.deleteDocumentDialog = true;
    },

    deleteDocument() {
      this.registryDocFile.splice(this.selectedIndex, 1);
      this.$emit("update:documentAttachment", this.registryDocFile);
      this.deleteDocumentDialog = false;
    },

    async getAttachmentDetails(selectedAttachment) {
      for (let item of selectedAttachment) {
        try {
          this.readerFile = await this.handleUpload(item);
        } catch (e) {
          console.log(e);
        }
        let obj = {};
        let name = "";
        name = item.name.split(".");
        obj.format = item.name.substr(item.name.lastIndexOf(".") + 1);
        obj.name = name[0];
        obj.base64 = this.readerFile;
        this.tempAttachmentChanged.push(obj);
      }
    },

    openEditDocumentDialog(item, index) {
      this.btnLoader = false;
      this.attachmentIndex = index;
      this.editDocumentDialog = true;
      this.tempAttachmentChanged = item;
    },

    editDocument() {
      this.documentAttachment.splice(
        this.attachmentIndex,
        1,
        this.tempAttachmentChanged
      );
      this.editDocumentDialog = false;
    },

    /*getBinaryFile(attachment) {
        let fileUrl = '/file/' + attachment.file.url;
        window.open(process.env.apiBaseUrl +fileUrl );
      },*/

    getShowDetailState(index) {
      this.showDetailState[index] = !this.showDetailState[index];
      console.log("showDetailState" + JSON.stringify(this.showDetailState));
    },

    destroyFileUploader() {
      this.documentAttachmentAPI = [];
      this.documentAttachment = [];
      this.registryDocFile = [];
      this.tempAttachment = [];
    }
  }
};
</script>
