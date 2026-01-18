<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" xs="12">
        <InsertButton
          :documentAttachment="props.documentAttachment"
          :selectedLang="uploader.selectedLang"
          :lang="props.lang"
          :badgeCounter="props.badgeCounter"
          :btnColor="props.btnColor"
          :maxFileCount="props.maxFileCount"
          @openInputDocumentModal="openInputDocumentModal"
        >
        </InsertButton>
        <SimpleUploader
          v-if="props.fileUploaderType === 'simple'"
          :documentAttachment="props.documentAttachment"
          :cols="props.cols"
          :thumb="props.thumb"
          :outlined="uploader.outlined"
          :raised="uploader.raised"
          :shaped="uploader.shaped"
          :tile="uploader.tile"
          :lang="props.lang"
          :cardType="props.cardType"
          :deletePermission="props.deletePermission"
          :editPermission="props.editPermission"
          :selectedLang="uploader.selectedLang"
          @setCardTheme="setCardTheme"
          @openDeleteDialog="openDeleteDialog"
          @openEditDocumentDialog="openEditDocumentDialog"
        >
        </SimpleUploader>
        <ThumbnailUploader
          v-if="props.fileUploaderType === 'thumbnail'"
          :documentAttachment="props.documentAttachment"
          :cols="props.cols"
          :thumb="props.thumb"
          :outlined="uploader.outlined"
          :raised="uploader.raised"
          :shaped="uploader.shaped"
          :tile="uploader.tile"
          :lang="props.lang"
          :cardType="props.cardType"
          :deletePermission="props.deletePermission"
          :editPermission="props.editPermission"
          :selectedLang="uploader.selectedLang"
          @setCardTheme="setCardTheme"
          @openDeleteDialog="(index: number, deleteId: string) => openDeleteDialog(index, deleteId)"
          @openEditDocumentDialog="(item: DocumentAttachment, index: number) => openEditDocumentDialog(item, index)"
        >
        </ThumbnailUploader>
        <TableUploader
          v-if="props.fileUploaderType === 'table'"
          :documentAttachment="props.documentAttachment"
          :cols="props.cols"
          :thumb="props.thumb"
          :outlined="uploader.outlined"
          :raised="uploader.raised"
          :shaped="uploader.shaped"
          :tile="uploader.tile"
          :lang="props.lang"
          :tableThumbColumn="props.tableThumbColumn"
          :tableFixedHeader="props.tableFixedHeader"
          :tableHeight="props.tableHeight"
          :cardType="props.cardType"
          :deletePermission="props.deletePermission"
          :editPermission="props.editPermission"
          :selectedLang="uploader.selectedLang"
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
        v-model="uploader.insertDocumentDialog"
        :scrollable="false"
        persistent
        width="50%"
      >
        <v-card>
          <v-card-title>
            <v-icon @click="uploader.insertDocumentDialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text>
            <template v-if="uploader.tempAttachment.length === 0">
              <v-file-input
                v-if="props.fileAccept !== ''"
                multiple
                :accept="props.fileAccept"
                chip
                v-model="uploader.tempAttachment"
                :label="uploader.selectedLang[lang].insertNewFile"
              ></v-file-input>
              <v-file-input
                v-else
                multiple
                v-model="uploader.tempAttachment"
                :label="uploader.selectedLang[lang].insertNewFile"
              ></v-file-input>
            </template>
            <template v-else>
              <v-expansion-panels
                v-if="props.addFileTag || props.addFileDescription || props.changeFileName"
              >
                <v-expansion-panel
                  v-for="(attachment, index) in uploader.tempAttachmentChanged"
                  :key="`attachment-${index}`"
                >
                  <v-expansion-panel-title>{{
                    attachment.file.name
                  }}</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row align="center" justify="center">
                      <v-col cols="12" lg="9" md="9" xs="12">
                        <v-text-field
                          v-if="props.changeFileName"
                          :label="uploader.selectedLang[lang].fileName"
                          v-model="attachment.file.name"
                        >
                        </v-text-field>
                        <v-textarea
                          v-if="props.addFileDescription"
                          :label="uploader.selectedLang[lang].fileDescription"
                          auto-grow
                          row-height="1"
                          v-model="attachment.file.description"
                        >
                        </v-textarea>
                        <v-autocomplete
                          v-if="props.addFileTag"
                          v-model="attachment.file.tags"
                          :items="props.tags"
                          dense
                          chips
                          :label="uploader.selectedLang[lang].fileTags"
                          multiple
                        ></v-autocomplete>
                      </v-col>
                      <v-col align="center" cols="12" lg="3" md="3" xs="12">
                        <template
                          v-if="
                            attachment.file.format === 'jpg' ||
                              attachment.file.format === 'jpeg' ||
                              attachment.file.format === 'png' ||
                              attachment.file.format === 'tif' ||
                              attachment.file.format === 'bmp'
                          "
                        >
                          <v-card>
                            <v-img :src="'data:' + attachment.file.format + ';base64,' + attachment.file.base64"></v-img>
                          </v-card>
                        </template>
                        <template v-else>
                          <select-file-icon-type
                            :file-format="attachment.file.format"
                            :size="60"
                          >
                          </select-file-icon-type>
                        </template>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-card v-else class="mx-auto" tile>
                <v-list-item
                  v-for="(attachment, index) in uploader.tempAttachmentChanged"
                  :key="`attachment-${index}`"
                  style="border-bottom: 1px solid #E0E0E0"
                >
                  <v-list-item-title>
                    <select-file-icon-type 
                      :file-format="attachment.file.format"
                      :size="24"
                    >
                    </select-file-icon-type>
                    {{ attachment.file.name }}.{{ attachment.file.format }}
                  </v-list-item-title>
                </v-list-item>
              </v-card>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="uploader.tempAttachment == null || uploader.btnLoader"
              :loading="uploader.btnLoader"
              :color="props.btnColor"
              @click="uploadFieldChange"
              >{{ uploader.selectedLang[lang].add }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Insert New Document Dialog End-------------------------------------------------------------------->
    <!--Update Document Dialog Start---------------------------------------------------------------------->
    <v-row justify="center">
      <v-dialog
        v-model="uploader.editDocumentDialog"
        :scrollable="false"
        persistent
        width="50%"
      >
        <v-card>
          <v-card-title>
            <v-icon @click="uploader.editDocumentDialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text
            v-for="(attachment, index) in uploader.tempAttachmentChanged"
            :key="`attachment-${index}`"
          >
            <v-row align="center" justify="center">
              <v-col cols="12" lg="9" md="9" xs="12">
                <v-text-field
                  v-if="props.changeFileName"
                  :label="uploader.selectedLang[lang].fileName"
                  v-model="attachment.file.name"
                >
                </v-text-field>
                <v-textarea
                  v-if="props.addFileDescription"
                  :label="uploader.selectedLang[lang].fileDescription"
                  auto-grow
                  row-height="1"
                  v-model="attachment.file.description"
                >
                </v-textarea>
                <v-autocomplete
                  v-if="props.addFileTag"
                  v-model="attachment.file.tags"
                  :items="props.tags"
                  dense
                  chips
                  :label="uploader.selectedLang[lang].fileTags"
                  multiple
                ></v-autocomplete>
              </v-col>
              <v-col align="center" cols="12" lg="3" md="3" xs="12">
                <template
                  v-if="
                    attachment.file.name && 
                    ['jpg', 'jpeg', 'png', 'tif', 'bmp'].includes(
                      attachment.file.name.split('.').pop()?.toLowerCase() || ''
                    )
                  "
                >
                  <v-card>
                    <v-img
                      :src="
                        'data:' + attachment.file.format + ';base64,' + attachment.file.base64
                      "
                    ></v-img>
                  </v-card>
                </template>
                <template v-else>
                  <select-file-icon-type
                    :file-format="attachment.file.format"
                    :size="60"
                  >
                  </select-file-icon-type>
                </template>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="uploader.tempAttachment === null || uploader.btnLoader"
              :loading="uploader.btnLoader"
              :color="props.btnColor"
              @click="editDocument"
              >{{ uploader.selectedLang[lang].edit }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Update Document Dialog End------------------------------------------------------------------------>

    <!--File Uploader SnackBar Alert Start --------------------------------------------------------------->
    <v-snackbar
      v-model="uploader.fileUploaderSnackBarAlert"
      right
      bottom
      :color="uploader.fileUploaderSnackBarAlertColor"
      :timeout="3000"
    >
      {{ uploader.fileUploaderSnackText }}
      <v-btn color="white" text @click="uploader.fileUploaderSnackBarAlert = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
    <!--File Uploader SnackBar Alert Start -->
    <!--DELETE Dialog End----------------------------------------------------------START---->
    <v-row justify="center">
      <v-dialog v-model="uploader.deleteDocumentDialog" persistent width="30%">
        <v-card>
          <v-card-title>
            <v-icon color="red"></v-icon>
          </v-card-title>
          <v-card-text>
            {{ uploader.selectedLang[lang].deleteDialog.message }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="uploader.deleteDocumentDialog = false"
              >{{ uploader.selectedLang[lang].deleteDialog.cancel }}</v-btn
            >
            <v-btn
              color="primary"
              :disabled="uploader.btnLoader"
              :loading="uploader.btnLoader"
              @click="deleteDocument"
              >{{ uploader.selectedLang[lang].delete }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--DELETE Dialog End----------------------------------------------------------------END---->
  </v-container>
</template>

<script setup lang="ts">
import InsertButton from "./InsertButton.vue";
import SimpleUploader from "./SimpleUploader.vue";
import ThumbnailUploader from "./ThumbnailUploader.vue";
import TableUploader from "./TableUploader.vue";
import SelectFileIconType from "./SelectFileIconType.vue";
import { languages } from "@/lib/language";
import { onBeforeMount, onDeactivated, reactive, watch } from "vue";
import type { 
  HandyUploaderProps, 
  HandyUploaderEvents, 
  DocumentAttachment, 
  LanguageCode,
  CardType,
  FileUploaderType,
  LanguageCollection
} from "@/types";
import { useFileUpload } from "@/composables/useFileUpload";
import { useErrorHandler } from "@/composables/useErrorHandler";
import { formatFileSize, isImageFile } from "@/utils/fileUtils";
import { propValidators, validateHandyUploaderProps } from "@/utils/propValidation";

interface Props {
  documentAttachment: DocumentAttachment[];
  lang: LanguageCode;
  maxFileSize?: number;
  fileUploaderType?: FileUploaderType;
  maxFileCount?: number;
  badgeCounter?: boolean;
  btnColor?: string;
  imageCompressor?: boolean;
  imageCompressLevel?: number;
  fileAccept?: string;
  thumb?: boolean;
  tableThumbColumn?: boolean;
  tableFixedHeader?: boolean;
  tableHeight?: number;
  rtlSupport?: boolean;
  changeFileName?: boolean;
  addFileDescription?: boolean;
  addFileTag?: boolean;
  tags?: string[];
  customLang?: LanguageCollection | null;
  insertPermission?: boolean;
  cols?: number;
  editPermission?: boolean;
  deletePermission?: boolean;
  cardType?: CardType;
  outlined?: boolean;
  raised?: boolean;
  shaped?: boolean;
  tile?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxFileSize: 5242880, // 5MB in bytes
  fileUploaderType: "thumbnail",
  maxFileCount: 10,
  badgeCounter: true,
  btnColor: "info",
  imageCompressLevel: 0.8,
  thumb: true,
  tableFixedHeader: true,
  tableHeight: 400,
  lang: "en",
  rtlSupport: false,
  changeFileName: false,
  addFileDescription: false,
  addFileTag: false,
  cols: 3,
  customLang: null,
  insertPermission: true,
  editPermission: true,
  deletePermission: true,
  cardType: "default",
})

// Validate props in development mode
if (process.env.NODE_ENV === 'development') {
  const validation = validateHandyUploaderProps(props);
  if (!validation.isValid) {
    console.error('HandyUploader prop validation failed:', validation.errors);
  }
  if (validation.warnings.length > 0) {
    console.warn('HandyUploader prop validation warnings:', validation.warnings);
  }
}

const uploader = reactive({
      insertDocumentDialog: false,
      editDocumentDialog: false,
      deleteDocumentDialog: false,
      tempAttachment: [] as File[],
      tempAttachmentChanged: [] as DocumentAttachment[],
      fileUploaderSnackBarAlert: false,
      fileUploaderSnackText: "",
      fileUploaderSnackBarAlertColor: "green",
      readerFile: null as File | null,
      registryDocFile: [] as DocumentAttachment[],
      documentAttachmentAPI: [] as DocumentAttachment[],
      btnLoader: false,
      showDetail: false,
      showDetailState: [] as boolean[],
      selectedIndex: 0,
      selectedId: "",
      returnedRecord: {} as Record<string, any>,
      outlined: false,
      raised: false,
      shaped: false,
      tile: false,
      selectedLang: {} as LanguageCollection,
      beforeInsertAttachments: {} as Record<string, any>,
      attachmentIndex: 0
    });

const emits = defineEmits([
    'updateCardType',
    'updateBadgeCounter',
    'updateMaxFileCount',
    'updateMaxFileSize',
    'updateImageCompressor',
    'updateImageCompressLevel',
    'updateFileAccept',
    'updateThumb',
    'updateChangeFileName',
    'updateAddFileDescription',
    'updateTableThumbColumn',
    'updateTableFixedHeader',
    'updateTableHeight',
    'updateLang',
    'updateDocumentAttachment'
]);

onBeforeMount(() => {
    setLang();
    uploader.registryDocFile = props.documentAttachment;
    if (props.rtlSupport) {
      changeRTL();
    }
    setCardTheme();
});

watch(
    () => uploader.tempAttachment,
    (newValue: File[]) => {
    if (newValue && newValue.length > 0) {
      getAttachmentDetails(newValue);
    } else {
      uploader.tempAttachmentChanged = [];
    }
});
watch(() => props.cardType, (newValue) => {
    emits('updateCardType', newValue);
    setCardTheme();
});
watch(() => props.badgeCounter, (newValue) => {
    emits('updateBadgeCounter', newValue);
});
watch(() => props.maxFileCount, (newValue) => {
  emits('updateMaxFileCount', newValue);
});
watch(() => props.maxFileSize, (newValue) => {
  emits('updateMaxFileSize', newValue);
});
watch(() => props.maxFileSize, (newValue) => {
  emits('updateMaxFileSize', newValue);
});
watch(() => props.imageCompressor, (newValue) => {
  emits('updateImageCompressor', newValue);
});
watch(() => props.imageCompressLevel, (newValue) => {
  emits('updateImageCompressLevel', newValue);
});
watch(() => props.fileAccept, (newValue) => {
  emits('updateFileAccept', newValue);
});
watch(() => props.thumb, (newValue) => {
  emits('updateThumb', newValue);
});
watch(() => props.changeFileName, (newValue) => {
  emits('updateChangeFileName', newValue);
});
watch(() => props.addFileDescription, (newValue) => {
  emits('updateAddFileDescription', newValue);
});
watch(() => props.addFileTag, (newValue) => {
  emits('updateAddFileDescription', newValue);
});
watch(() => props.tableThumbColumn, (newValue) => {
  emits('updateTableThumbColumn', newValue);
});
watch(() => props.tableFixedHeader, (newValue) => {
  emits('updateTableFixedHeader', newValue);
});
watch(() => props.tableHeight, (newValue) => {
  emits('updateTableHeight', newValue);
});
watch(() => props.lang, (newValue) => {
  emits('updateLang', newValue);
});

onDeactivated(() => {
  uploader.registryDocFile = [];
});

const openInputDocumentModal = () => {
  uploader.btnLoader = false;
  uploader.tempAttachment = [];
  uploader.insertDocumentDialog = true;
};

const setLang = () => {
  if (props.customLang !== null) uploader.selectedLang = props.customLang;
  else uploader.selectedLang = languages as unknown as LanguageCollection;
};

const changeRTL = () => {
  // this.$vuetify.rtl = true;
};

const setCardTheme = () => {
  const themes: Record<CardType, { outlined: boolean; raised: boolean; shaped: boolean; tile: boolean }> = {
    default: { outlined: false, raised: false, shaped: false, tile: false },
    outlined: { outlined: true, raised: false, shaped: false, tile: false },
    shaped: { outlined: false, raised: false, shaped: true, tile: false },
    raised: { outlined: false, raised: true, shaped: false, tile: false },
    tile: { outlined: false, raised: false, shaped: false, tile: true },
  };

  // Access theme based on the provided cardType or default if undefined
  const theme = themes[props.cardType || 'default'];
  
  // Update uploader theme properties
  uploader.outlined = theme.outlined;
  uploader.raised = theme.raised;
  uploader.shaped = theme.shaped;
  uploader.tile = theme.tile;
};

const handleUpload = (fileAttachment: any) => {
  const reader = new FileReader();
  return new Promise(function(resolve) {
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(fileAttachment);
  });
};

const uploadFieldChange = async () => {
  uploader.btnLoader = true;

  const showSnackBarAlert = (message: string, color: string) => {
    uploader.fileUploaderSnackText = message;
    uploader.fileUploaderSnackBarAlertColor = color;
    uploader.fileUploaderSnackBarAlert = true;
  };

  for (const [index, item] of uploader.tempAttachmentChanged.entries()) {
    if (props.documentAttachment.length >= props.maxFileCount) {
      showSnackBarAlert(
        `${uploader.selectedLang[props.lang].maxFileCountAlert} ${props.maxFileCount}`,
        "red"
      );
      break;
    }

    if ((item.file.size / 1000) > props.maxFileSize) {
      showSnackBarAlert(
        `${uploader.selectedLang[props.lang].maxFileSizeAlert} ${Math.round(props.maxFileSize / 1024)} ${uploader.selectedLang[props.lang].size.mb}`,
        "red"
      );
      continue;
    }

    let tempFile: any = {};
    const file: any = {};

    // The item is already a processed DocumentAttachment object
    const fileData = item.file;
    const fileType = fileData.format;
    let status = false;
    let imgFile: string = "";
    let base64Data = fileData.base64;

    if (props.imageCompressor && ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(fileType)) {
      status = true;
      imgFile = await compressImage(`data:${fileType};base64,${base64Data}`) as string;
      base64Data = imgFile.split(",")[1];
    }

    try {
      // Sanitize base64Data by removing any invalid characters (e.g., whitespace)
      const sanitizedBase64Data = base64Data.replace(/\s/g, "");

      tempFile = {
        base64: sanitizedBase64Data,
        size: status ? (atob(sanitizedBase64Data).length / 1024).toFixed(1) : fileData.size.toString(),
        name: `${fileData.name}.${fileData.format}`,
        tags: fileData.tags || [],
        description: fileData.description || "",
        showDetailState: false,
        format: fileType,
      };

      file.file = tempFile;
      uploader.registryDocFile.push(file);
      emits("updateDocumentAttachment", uploader.registryDocFile);
    } catch (error) {
      console.error("Error processing Base64 string:", error);
      showSnackBarAlert("File could not be processed due to an invalid format.", "red");
      continue;
    }
  }

  uploader.documentAttachmentAPI = [];
  uploader.tempAttachmentChanged = [];
  uploader.insertDocumentDialog = false;
  uploader.btnLoader = false;
};


const compressImage = (base64: any) => {
  const canvas = document.createElement("canvas");
  const img = document.createElement("img");

  return new Promise((resolve, reject) => {
    const imageCompressLevelTemp = props.imageCompressLevel;
    img.onload = function() {
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", imageCompressLevelTemp));
    };
    img.onerror = function(err) {
      reject(err);
    };
    img.src = base64;
  });
};

const convertBase64ToFile = (base64: any, fileName: any) => {
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
};

const openDeleteDialog = (index: number, deleteId: string) => {
  uploader.btnLoader = false;
  uploader.selectedIndex = index;
  uploader.selectedId = deleteId;
  uploader.deleteDocumentDialog = true;
};

const deleteDocument = () => {
  uploader.registryDocFile.splice(uploader.selectedIndex, 1);
  emits("updateDocumentAttachment", uploader.registryDocFile);
  uploader.deleteDocumentDialog = false;
};

const getAttachmentDetails = async (selectedAttachment: File[]) => {
  for (const item of selectedAttachment) {
    let base64Result: string = "";
    try {
      base64Result = await handleUpload(item) as string;
    } catch (e) {
      console.log(e);
      continue;
    }
    const fileData = {
      name: item.name.split(".")[0],
      format: item.name.substr(item.name.lastIndexOf(".") + 1),
      base64: base64Result.split(",")[1], // Remove data:mime;base64, prefix
      size: item.size,
      tags: [],
      description: null,
      showDetailState: false
    };
    const documentAttachment = { file: fileData };
    uploader.tempAttachmentChanged.push(documentAttachment);
  }
};

const openEditDocumentDialog = (item: DocumentAttachment, index: number) => {
  uploader.btnLoader = false;
  uploader.attachmentIndex = index;
  uploader.editDocumentDialog = true;
  uploader.tempAttachmentChanged = [item]; // Wrap in array to match the type
};

const editDocument = () => {
  // Create a copy of the documentAttachment array
  const updatedAttachments = [...props.documentAttachment];
  // Update the specific item (use first element since tempAttachmentChanged is an array with one item)
  updatedAttachments.splice(
    uploader.attachmentIndex,
    1,
    uploader.tempAttachmentChanged[0]
  );
  // Emit the updated array to parent component
  emits('updateDocumentAttachment', updatedAttachments);
  uploader.editDocumentDialog = false;
};

/*getBinaryFile(attachment) {
    let fileUrl = '/file/' + attachment.file.url;
    window.open(process.env.apiBaseUrl +fileUrl );
  },*/

const getShowDetailState = (index: string | number) => {
  uploader.showDetailState[index as number] = !uploader.showDetailState[index as number];
};

const destroyFileUploader = () => {
  uploader.documentAttachmentAPI = [];
  uploader.registryDocFile = [];
  emits('updateDocumentAttachment', []);
  uploader.tempAttachment = [];
};
</script>
