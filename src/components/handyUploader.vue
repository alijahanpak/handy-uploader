<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" xs="12">
        <template v-if="badgeCounter">
          <template v-if="documentAttachment.length > 0">
            <v-badge
              bordered
              :color="documentAttachment.length===maxFileCount ? 'error' : 'success'"
              overlap
              :content="documentAttachment.length"
            >
              <v-btn :color="btnColor" @click="openInputDocumentModal">
                {{ selectedLang[lang].insertFile }}
              </v-btn>
            </v-badge>
          </template>
          <template v-else>
            <v-btn :color="btnColor" @click="openInputDocumentModal">
              {{ selectedLang[lang].insertFile }}
            </v-btn>
          </template>
        </template>
        <template v-if="!badgeCounter">
          <v-btn :color="btnColor" @click="openInputDocumentModal">
            {{ selectedLang[lang].insertFile }}
          </v-btn>
        </template>
        <v-row v-if="fileUploaderType === 'simple'">
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
                  <v-list-item-subtitle color="blue-grey darken-3">
                    {{ attachment.file.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-if="
                      Number((attachment.file.size / 1000).toFixed(1)) < 1024
                    "
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
                    v-if="
                      Number((attachment.file.size / 1000).toFixed(1)) > 1024
                    "
                  >
                    <v-chip color="teal lighten-2" label text-color="white">
                      {{
                        Number(
                          ((attachment.file.size / 1000
                        ) / 1024 ).toFixed(1)) +
                        "  " +
                        selectedLang[lang].size.mb }}
                      <v-icon right>mdi-harddisk</v-icon>
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar
                  tile
                  size="80"
                  color="blue-grey lighten-5"
                >
                  <template v-if="attachment.file.name.split('.').pop().toLowerCase() == 'jpg' || attachment.file.name.split('.').pop().toLowerCase() == 'jpeg' || attachment.file.name.split('.').pop().toLowerCase() == 'png' || attachment.file.name.split('.').pop().toLowerCase() == 'tif' || attachment.file.name.split('.').pop().toLowerCase() == 'bmp'">
                    <v-img
                      v-if="thumb"
                      :src="'data:'+ attachment.file.format  + ',' + attachment.file.base64 "
                    ></v-img>
                    <v-icon v-else  style="margin-left: 10px" size="50" file-word-outline color="deep-purple darken-1">mdi-file-image-outline</v-icon>
                  </template>
                  <template v-else>
                    <v-icon  v-if="attachment.file.name.split('.').pop().toLowerCase() == 'pdf'" x-large file-word-outline color="red darken-1">mdi-file-pdf-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'doc' || attachment.file.name.split('.').pop().toLowerCase() == 'docx' || attachment.file.name.split('.').pop().toLowerCase() == 'odt'" x-large file-word-outline color="blue darken-1">mdi-file-word-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'jpg' || attachment.file.name.split('.').pop().toLowerCase() == 'jpeg' || attachment.file.name.split('.').pop().toLowerCase() == 'png' || attachment.file.name.split('.').pop().toLowerCase() == 'tif' || attachment.file.name.split('.').pop().toLowerCase() == 'bmp'" x-large file-word-outline color="deep-purple darken-1">mdi-file-image-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'xls' || attachment.file.name.split('.').pop().toLowerCase() == 'xlsx'" x-large file-word-outline color="teal darken-1">mdi-file-excel-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'pptx' || attachment.file.name.split('.').pop().toLowerCase() == 'pptm' || attachment.file.name.split('.').pop().toLowerCase() == 'ppt'" x-large file-word-outline color="orange darken-3">mdi-file-powerpoint-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'mp4' || attachment.file.name.split('.').pop().toLowerCase() == 'mov' || attachment.file.name.split('.').pop().toLowerCase() == 'flv' || attachment.file.name.split('.').pop().toLowerCase() == 'wmv' || attachment.file.name.split('.').pop().toLowerCase() == 'avi'" x-large file-word-outline color="red lighten-1">mdi-file-video-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'dwg' " x-large file-word-outline color="indigo lighten-2">mdi-file-cad</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'zip' || attachment.file.name.split('.').pop().toLowerCase() == 'rar' || attachment.file.name.split('.').pop().toLowerCase() == '7-zip'   " x-large file-word-outline color="lime lighten-1">mdi-folder-zip-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'txt' " x-large file-word-outline color="light-green darken-3">mdi-script-text-outline</v-icon>
                    <v-icon  v-else x-large file-word-outline color="indigo lighten-1">mdi-file-question-outline</v-icon>
                  </template>
                </v-list-item-avatar>
              </v-list-item>
              <v-divider
                      class="mx-4"
              ></v-divider>
              <v-card-actions style="padding: 0">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn text fab v-on="on"  @click="openDeleteDialog(index , '')"><v-icon color="red">mdi-trash-can-outline</v-icon></v-btn>
                  </template>
                  <span class="BYekan">{{selectedLang[lang].delete}}</span>
                </v-tooltip>

                <v-spacer></v-spacer>

                <v-btn
                  v-if="attachment.file.tags.length > 0 || attachment.file.description !== ''"
                  icon
                  @click.prevent="attachment.file.showDetailState = !attachment.file.showDetailState"
                >
                  <v-icon>{{ attachment.file.showDetailState ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <template v-if="attachment.file.tags.length > 0 || attachment.file.description !== ''">
                  <div v-show="attachment.file.showDetailState">
                    <v-divider></v-divider>
                    <v-chip-group
                      v-if="attachment.file.tags.length > 0"
                      multiple
                      active-class="primary--text"
                      style="padding: 8px"
                    >
                      <v-chip v-for="(tag,index) in attachment.file.tags" :key="`attachment-${index}`" style="margin: 5px">
                        {{tag}}
                      </v-chip>
                    </v-chip-group>
                    <v-card-text v-if="attachment.file.description != null" style="text-align: justify">
                      {{attachment.file.description}}
                    </v-card-text>
                  </div>
                </template>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else-if="fileUploaderType === 'thumbnail'">
          <v-col v-for="(attachment, index) in documentAttachment" :key="`attachment-${index}`" cols="12" md="4" xs="12">
            <v-card
              :shaped="shaped"
              :outlined="outlined"
              :raised="raised"
              :tile="tile"
              class="mx-auto"
              max-width="344"
            >
              <template v-if="attachment.file.name.split('.').pop().toLowerCase() == 'jpg' || attachment.file.name.split('.').pop().toLowerCase() == 'jpeg' || attachment.file.name.split('.').pop().toLowerCase() == 'png' || attachment.file.name.split('.').pop().toLowerCase() == 'tif' || attachment.file.name.split('.').pop().toLowerCase() == 'bmp'">
                <v-img
                        :src="'data:'+ attachment.file.format  + ',' + attachment.file.base64 "
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
                    <v-icon  v-if="attachment.file.name.split('.').pop().toLowerCase() == 'pdf'" size="120" file-word-outline color="red darken-1">mdi-file-pdf-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'doc' || attachment.file.name.split('.').pop().toLowerCase() == 'docx' || attachment.file.name.split('.').pop().toLowerCase() == 'odt'" size="120" file-word-outline color="blue darken-1">mdi-file-word-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'xls' || attachment.file.name.split('.').pop().toLowerCase() == 'xlsx'" size="120" file-word-outline color="teal darken-1">mdi-file-excel-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'pptx' || attachment.file.name.split('.').pop().toLowerCase() == 'pptm' || attachment.file.name.split('.').pop().toLowerCase() == 'ppt'" size="120" file-word-outline color="orange darken-3">mdi-file-powerpoint-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'mp4' || attachment.file.name.split('.').pop().toLowerCase() == 'mov' || attachment.file.name.split('.').pop().toLowerCase() == 'flv' || attachment.file.name.split('.').pop().toLowerCase() == 'wmv' || attachment.file.name.split('.').pop().toLowerCase() == 'avi'" size="120" file-word-outline color="red lighten-1">mdi-file-video-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'dwg' " size="120" file-word-outline color="indigo lighten-2">mdi-file-cad</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'zip' || attachment.file.name.split('.').pop().toLowerCase() == 'rar' || attachment.file.name.split('.').pop().toLowerCase() == '7-zip'   " size="120" file-word-outline color="lime lighten-1">mdi-folder-zip-outline</v-icon>
                    <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'txt' " size="120" file-word-outline color="light-green darken-3">mdi-script-text-outline</v-icon>
                    <v-icon  v-else x-large file-word-outline color="indigo lighten-1">mdi-file-question-outline</v-icon>
                  </template>
                </v-list-item-avatar>
              </template>

              <v-card-subtitle style="height: 70px">
                {{attachment.file.name}}
              </v-card-subtitle>
              <v-card-subtitle v-if="Number((attachment.file.size / 1000).toFixed(1)) < 1024" class="mt2">
                <v-chip
                  color="teal lighten-2"
                  label
                  text-color="white"
                >
                  {{  Number((attachment.file.size / 1000).toFixed(1)) +'  '+ selectedLang[lang].size.kb}}
                  <v-icon right>mdi-harddisk</v-icon>
                </v-chip>
              </v-card-subtitle>
              <v-card-subtitle v-if="Number((attachment.file.size / 1000).toFixed(1)) > 1024">
                <v-chip
                  color="teal lighten-2"
                  label
                  text-color="white"
                >
                  {{  Number(((attachment.file.size / 1000) / 1024 ).toFixed(1)) +'  '+ selectedLang[lang].size.mb}}
                  <v-icon right>mdi-harddisk</v-icon>
                </v-chip>
              </v-card-subtitle>
              <v-divider
                      class="mx-4"
              ></v-divider>
              <v-spacer></v-spacer>
              <!--<v-card-actions>
                <v-btn text @click="openDeleteDialog(index , '')" >{{selectedLang[lang].delete}}</v-btn>
                <v-spacer></v-spacer>

              </v-card-actions>-->
              <v-card-actions style="padding: 0">
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn text fab v-on="on"  @click="openDeleteDialog(index , '')"><v-icon color="red">mdi-trash-can-outline</v-icon></v-btn>
                  </template>
                  <span class="BYekan">{{selectedLang[lang].delete}}</span>
                </v-tooltip>

                <v-spacer></v-spacer>

                <v-btn
                  v-if="attachment.file.tags.length > 0 || attachment.file.description !== ''"
                  icon
                  @click.prevent="attachment.file.showDetailState = !attachment.file.showDetailState"
                >
                  <v-icon>{{ attachment.file.showDetailState ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-card-actions>

              <v-expand-transition>
                <template v-if="attachment.file.tags.length > 0 || attachment.file.description !== ''">
                  <div v-show="attachment.file.showDetailState">
                    <v-divider></v-divider>
                    <v-chip-group
                      v-if="attachment.file.tags.length > 0"
                      multiple
                      active-class="primary--text"
                      style="padding: 8px"
                    >
                      <v-chip v-for="(tag,index) in attachment.file.tags" :key="`attachment-${index}`" style="margin: 5px">
                        {{tag}}
                      </v-chip>
                    </v-chip-group>
                    <v-card-text v-if="attachment.file.description != null" style="text-align: justify">
                      {{attachment.file.description}}
                    </v-card-text>
                  </div>
                </template>
              </v-expand-transition>

            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="fileUploaderType === 'table'">
          <v-col cols="12" lg="12" md="12" xs="12">
            <v-simple-table :fixed-header="tableFixedHeader" :height="tableHeight + 'px'">
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-if="tableThumbColumn" class="text-left">{{selectedLang[lang].table.thumb}}</th>
                  <th class="text-left">{{selectedLang[lang].table.name}}</th>
                  <th class="text-left">{{selectedLang[lang].table.size}}</th>
                  <th class="text-left">{{selectedLang[lang].table.action.action}}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(attachment, index) in documentAttachment" :key="`attachment-${index}`">
                  <td v-if="tableThumbColumn">
                    <template v-if="attachment.file.name.split('.').pop().toLowerCase() == 'jpg' || attachment.file.name.split('.').pop().toLowerCase() == 'jpeg' || attachment.file.name.split('.').pop().toLowerCase() == 'png' || attachment.file.name.split('.').pop().toLowerCase() == 'tif' || attachment.file.name.split('.').pop().toLowerCase() == 'bmp'">
                      <v-img
                        v-if="thumb"
                        style="margin: 10px"
                        :src="'data:'+ attachment.file.format  + ',' + attachment.file.base64 "
                        height="50px"
                        width="50px"
                      ></v-img>
                      <v-icon v-else  style="margin-left: 10px" size="50" file-word-outline color="deep-purple darken-1">mdi-file-image-outline</v-icon>
                    </template>
                    <template v-else>
                      <v-icon  v-if="attachment.file.name.split('.').pop().toLowerCase() == 'pdf'" style="margin-left: 10px" size="50" file-word-outline color="red darken-1">mdi-file-pdf-outline</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'doc' || attachment.file.name.split('.').pop().toLowerCase() == 'docx' || attachment.file.name.split('.').pop().toLowerCase() == 'odt'"  style="margin-left: 10px" size="50" file-word-outline color="blue darken-1">mdi-file-word-outline</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'xls' || attachment.file.name.split('.').pop().toLowerCase() == 'xlsx'"  style="margin-left: 10px" size="50" file-word-outline color="teal darken-1">mdi-file-excel-outline</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'pptx' || attachment.file.name.split('.').pop().toLowerCase() == 'pptm' || attachment.file.name.split('.').pop().toLowerCase() == 'ppt'"  style="margin-left: 10px" size="50" file-word-outline color="orange darken-3">mdi-file-powerpoint-outline</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'mp4' || attachment.file.name.split('.').pop().toLowerCase() == 'mov' || attachment.file.name.split('.').pop().toLowerCase() == 'flv' || attachment.file.name.split('.').pop().toLowerCase() == 'wmv' || attachment.file.name.split('.').pop().toLowerCase() == 'avi'"  style="margin-left: 10px" size="50" file-word-outline color="red lighten-1">mdi-file-video-outline</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'dwg' "  style="margin-left: 10px" size="50" file-word-outline color="indigo lighten-2">mdi-file-cad</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'zip' || attachment.file.name.split('.').pop().toLowerCase() == 'rar' || attachment.file.name.split('.').pop().toLowerCase() == '7-zip'   " size="120" file-word-outline color="lime lighten-1">mdi-folder-zip-outline</v-icon>
                      <v-icon  v-else-if="attachment.file.name.split('.').pop().toLowerCase() == 'txt' "  style="margin-left: 10px" size="50" file-word-outline color="light-green darken-3">mdi-script-text-outline</v-icon>
                      <v-icon  v-else x-large file-word-outline color="indigo lighten-1">mdi-file-question-outline</v-icon>
                    </template>
                  </td>
                  <td>{{ attachment.file.name }}</td>
                  <td>
                    <v-card-subtitle v-if="Number((attachment.file.size / 1000).toFixed(1)) < 1024" class="mt2">
                      <v-chip
                        color="teal lighten-2"
                        label
                        text-color="white"
                      >
                        {{  Number((attachment.file.size / 1000).toFixed(1)) + selectedLang[lang].size.kb}}
                        <v-icon right>mdi-harddisk</v-icon>
                      </v-chip>
                    </v-card-subtitle>
                    <v-card-subtitle v-if="Number((attachment.file.size / 1000).toFixed(1)) > 1024">
                      <v-chip
                        color="teal lighten-2"
                        label
                        text-color="white"
                      >
                        {{  Number(((attachment.file.size / 1000) / 1024 ).toFixed(1)) + selectedLang[lang].size.mb}}
                        <v-icon right>mdi-harddisk</v-icon>
                      </v-chip>
                    </v-card-subtitle>
                  </td>
                  <td>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn icon color="red" v-on="on" @click="openDeleteDialog(index , '')" ><v-icon>mdi-delete</v-icon></v-btn>
                      </template>
                      <span>{{selectedLang[lang].table.action.deleteTooltip}}</span>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!--Insert New Document Dialog Start-->
    <v-row justify="center">
      <v-dialog v-model="insertDocumentDialog" :scrollable="false" persistent width="50%">
        <v-card>
          <v-card-title>
            <v-icon @click="insertDocumentDialog = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="BYekan">
            <template v-if="tempAttachment.length === 0">
              <v-file-input v-if="fileAccept !== ''" multiple :accept="fileAccept" chip v-model="tempAttachment" :label="selectedLang[lang].insertNewFile"></v-file-input>
              <v-file-input v-else multiple v-model="tempAttachment" :label="selectedLang[lang].insertNewFile"></v-file-input>
            </template>
            <template>
              <v-expansion-panels v-if="addFileTag || addFileDescription || changeFileName">
                <v-expansion-panel
                  v-for="(attachment,index) in tempAttachmentChanged" :key="`attachment-${index}`"
                >
                  <v-expansion-panel-header>{{attachment.name}}</v-expansion-panel-header>
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
                        <template v-if="attachment.format == 'jpg' || attachment.format == 'jpeg' || attachment.format == 'png' || attachment.format == 'tif' || attachment.format == 'bmp'">
                          <v-card>
                            <v-img
                              :src="attachment.base64 "
                            ></v-img>
                          </v-card>
                        </template>
                        <template v-else>
                          <v-icon  v-if="attachment.format == 'pdf'" size="60" file-word-outline color="red darken-1">mdi-file-pdf-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'doc' || attachment.format == 'docx' || attachment.format == 'odt'" size="60" file-word-outline color="blue darken-1">mdi-file-word-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'jpg' || attachment.format == 'jpeg' || attachment.format == 'png' || attachment.format == 'tif' || attachment.format == 'bmp'" size="60" file-word-outline color="deep-purple darken-1">mdi-file-image-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'xls' || attachment.format == 'xlsx'" size="60" file-word-outline color="teal darken-1">mdi-file-excel-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'pptx' || attachment.format == 'pptm' || attachment.format == 'ppt'" size="60" file-word-outline color="orange darken-3">mdi-file-powerpoint-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'mp4' || attachment.format == 'mov' || attachment.format == 'flv' || attachment.format == 'wmv' || attachment.format == 'avi'" size="60" file-word-outline color="red lighten-1">mdi-file-video-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'dwg' " size="60" file-word-outline color="indigo lighten-2">mdi-file-cad</v-icon>
                          <v-icon  v-else-if="attachment.format == 'zip' || attachment.format == 'rar' || attachment.format == '7-zip'   " size="60" file-word-outline color="lime lighten-1">mdi-folder-zip-outline</v-icon>
                          <v-icon  v-else-if="attachment.format == 'txt' " size="60" file-word-outline color="light-green darken-3">mdi-script-text-outline</v-icon>
                          <v-icon  v-else size="60" file-word-outline color="indigo lighten-1">mdi-file-question-outline</v-icon>
                        </template>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-card
                v-else
                class="mx-auto"
                tile
              >
                <v-list-item v-for="(attachment, index) in tempAttachmentChanged" :key="`attachment-${index}`" style="border-bottom: 1px solid #E0E0E0">
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon  v-if="attachment.format == 'pdf'" size="30" file-word-outline color="red darken-1">mdi-file-pdf-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'doc' || attachment.format == 'docx' || attachment.format == 'odt'" size="30" file-word-outline color="blue darken-1">mdi-file-word-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'jpg' || attachment.format == 'jpeg' || attachment.format == 'png' || attachment.format == 'tif' || attachment.format == 'bmp'" size="30" file-word-outline color="deep-purple darken-1">mdi-file-image-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'xls' || attachment.format == 'xlsx'" size="30" file-word-outline color="teal darken-1">mdi-file-excel-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'pptx' || attachment.format == 'pptm' || attachment.format == 'ppt'" size="30" file-word-outline color="orange darken-3">mdi-file-powerpoint-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'mp4' || attachment.format == 'mov' || attachment.format == 'flv' || attachment.format == 'wmv' || attachment.format == 'avi'" size="30" file-word-outline color="red lighten-1">mdi-file-video-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'dwg' " size="30" file-word-outline color="indigo lighten-2">mdi-file-cad</v-icon>
                      <v-icon  v-else-if="attachment.format == 'zip' || attachment.format == 'rar' || attachment.format == '7-zip'   " size="30" file-word-outline color="lime lighten-1">mdi-folder-zip-outline</v-icon>
                      <v-icon  v-else-if="attachment.format == 'txt' " size="30" file-word-outline color="light-green darken-3">mdi-script-text-outline</v-icon>
                      <v-icon  v-else size="30" file-word-outline color="indigo lighten-1">mdi-file-question-outline</v-icon>
                      {{attachment.name}}.{{attachment.format}}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn class="BYekan" :disabled="tempAttachment == null || btnLoader" :loading="btnLoader" :color="btnColor" @click="uploadFieldChange">{{selectedLang[lang].add}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--Insert New Document Dialog End--------------------------------------------------------------->
    <!--File Uploader SnackBar Alert Start --------------------------------------------------------------->
    <v-snackbar class="BYekan"
      v-model="fileUploaderSnackBarAlert"
      right
      bottom
      :color="fileUploaderSnackBarAlertColor"
      :timeout="3000"
    >
      {{fileUploaderSnackText}}
      <v-btn
        color="white"
        text
        @click="fileUploaderSnackBarAlert = false"
      >
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
            {{selectedLang[lang].deleteDialog.message}}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="BYekan" color="green darken-1" text @click="deleteDocumentDialog= false">{{selectedLang[lang].deleteDialog.cancel}}</v-btn>
            <v-btn class="BYekan" color="primary" :disabled="btnLoader" :loading="btnLoader" @click="deleteDocument">{{selectedLang[lang].delete}} </v-btn>
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
  import languages from "./language";
  export default {
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
        default: 5120,
      },
      /**
       * choose File Uploader Type
       */
      fileUploaderType: {
        type: String,
        default: 'thumbnail'
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
        default: 'info'
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
        default: 'en'
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
        type: Array,
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
    },
    data: () => ({
      insertDocumentDialog: false,
      deleteDocumentDialog: false,
      tempAttachment:[],
      tempAttachmentChanged:[],
      fileUploaderSnackBarAlert: false,
      fileUploaderSnackText: '',
      fileUploaderSnackBarAlertColor: 'green',
      readerFile: null,
      registryDocFile: [],
      documentAttachmentAPI: [],
      btnLoader: false,
      showDetail: false,
      showDetailState: [],
      selectedIndex: '',
      selectedId: '',
      returnedRecord: {},
      //Card Theme
      outlined: false,
      raised: false,
      shaped: false,
      tile: false,
      selectedLang: {},
      beforeInsertAttachments: {},
    }),
    watch: {
      tempAttachment : function(newValue){
        if(this.tempAttachment.length > 0)
          this.getAttachmentDetails(newValue);
        else this.tempAttachmentChanged = [];
      },
      cardType : function() {
        this.$emit('update:cardType', this.cardType);
        this.setCardTheme();
      },
      badgeCounter : function() {
        this.$emit('update:badgeCounter', this.badgeCounter);
      },
      maxFileCount : function() {
        this.$emit('update:maxFileCount', this.maxFileCount);
      },
      maxFileSize : function() {
        this.$emit('update:maxFileSize', Number(this.maxFileSize));
      },
      imageCompressor : function() {
        this.$emit('update:imageCompressor', this.imageCompressor);
      },
      imageCompressLevel : function() {
        this.$emit('update:imageCompressLevel', this.imageCompressLevel);
      },
      fileAccept : function() {
        this.$emit('update:fileAccept', this.fileAccept);
      },
      thumb : function() {
        this.$emit('update:thumb', this.thumb);
      },
      changeFileName : function() {
        this.$emit('update:changeFileName', this.changeFileName);
      },
      addFileDescription : function() {
        this.$emit('update:addFileDescription', this.addFileDescription);
      },
      addFileTag : function() {
        this.$emit('update:addFileTag', this.addFileTag);
      },
      tableThumbColumn : function() {
        this.$emit('update:tableThumbColumn', this.tableThumbColumn);
      },
      tableFixedHeader : function() {
        this.$emit('update:tableFixedHeader', this.tableFixedHeader);
      },
      tableHeight : function() {
        this.$emit('update:tableHeight', this.tableHeight);
      },
      lang : function() {
        this.$emit('update:lang', this.lang);
      },
    },
    computed: {

    },
    mounted () {

    },

    created(){
      if(this.rtlSupport)
        this.changeRTL();
      this.setLang();
      this.setCardTheme();
    },
    destroyed(){
      this.registryDocFile= [];
    },
    methods: {
      setLang(){
        if( this.customLang !== null)
          this.selectedLang= this.customLang;
        else
          this.selectedLang= languages;
      },
      changeRTL () {
        this.$vuetify.rtl = true
      },
      setCardTheme (){
        switch (this.cardType) {
          case 'default':
            this.outlined= false;
            this.raised= false;
            this.shaped= false;
            this.tile= false;
            break;
          case 'outlined':
            this.outlined= true;
            this.raised= false;
            this.shaped= false;
            this.tile= false;
            break;
          case 'shaped':
            this.shaped= true;
            this.raised= false;
            this.outlined= false;
            this.tile= false;
            break;
          case 'raised':
            this.raised= true;
            this.shaped= false;
            this.outlined= false;
            this.tile= false;
            break;
          case 'tile':
            this.tile= true;
            this.shaped= false;
            this.outlined= false;
            this.raised= false;
            break;
        }
      },

      openInputDocumentModal(){
        this.btnLoader= false;
        this.tempAttachment= [];
        this.insertDocumentDialog = true;
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
      async uploadFieldChange (){
        this.btnLoader= true;
        for(let [index,item] of this.tempAttachment.entries()){
          if(this.documentAttachment.length < this.maxFileCount) {
            if((item.size / 1000).toFixed(1) > this.maxFileSize){
              this.fileUploaderSnackBarAlertColor= 'red';
              this.fileUploaderSnackText= `${this.selectedLang[this.lang].maxFileSizeAlert} ${Math.round(this.maxFileSize / 1024)} ${this.selectedLang[this.lang].size.mb}`;
              this.fileUploaderSnackBarAlert= true;
            }
            else{
              let tempFile= {};
              let file = {};
              try {
                this.readerFile = await this.handleUpload(item);
              } catch (e) {
                console.log(e);
              }
              let fullFileType= this.readerFile.split(";");
              let fileType= fullFileType[0].split(":")
              let status = false;
              let imgFile= ''
              let sizeInKb=0;
              if(this.imageCompressor){
                if(fileType[1] === "image/png" || fileType[1] === "image/jpg" || fileType[1] === "image/jpeg" || fileType[1] === "application/octet-stream" || fileType[1] === "image/webp"){
                  status = true;
                  imgFile = await this.compressImage(this.readerFile, fileType[1]);
                }
              }
              //tempFile.subject= this.tempAttachmentChanged[index].name + '.' + this.tempAttachmentChanged[index].format;
              let strTemp= this.readerFile.split(",")
              if(status){
                let imgTemp= imgFile.split(",")
                tempFile.base64=imgTemp[1];
                sizeInKb= new Buffer(imgFile, 'base64').length;
                tempFile.size= String(sizeInKb);
              }
              else{
                tempFile.base64=strTemp[1];
                tempFile.size= String(item.size);
              }
              tempFile.name= this.tempAttachmentChanged[index].name+ '.' + this.tempAttachmentChanged[index].format;
              if(this.tempAttachmentChanged[index].tags === undefined)
                tempFile.tags= [];
              else
                tempFile.tags= this.tempAttachmentChanged[index].tags;
              if(this.tempAttachmentChanged[index].description === undefined)
                tempFile.description= '';
              else
                tempFile.description= this.tempAttachmentChanged[index].description;
              tempFile.showDetailState= false;

              tempFile.format= strTemp[0].replace('data:' ,'');
              file.file=tempFile;
              this.registryDocFile.push(file);
              this.$emit('update:documentAttachment' , this.registryDocFile);
              //console.log(JSON.stringify(this.registryDocFile));
            }
          }
          else {
            this.fileUploaderSnackBarAlertColor= 'red';
            this.fileUploaderSnackText= `${this.selectedLang[this.lang].maxFileCountAlert} ${this.maxFileCount}`
            this.fileUploaderSnackBarAlert= true;
          }
        }
        this.documentAttachmentAPI= [];
        this.tempAttachmentChanged= [];
        this.insertDocumentDialog= false;
      },

      compressImage (base64) {
        const canvas = document.createElement('canvas')
        const img = document.createElement('img')

        return new Promise((resolve, reject) => {
          let imageCompressLevelTemp= this.imageCompressLevel;
          img.onload = function () {
            let width = img.width
            let height = img.height
            /*const maxHeight = 1250
            const maxWidth = 1250

            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height *= maxWidth / width))
                width = maxWidth
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width *= maxHeight / height))
                height = maxHeight
              }
            }*/
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            resolve(canvas.toDataURL('image/jpeg', imageCompressLevelTemp))
          }
          img.onerror = function (err) {
            reject(err)
          }
          img.src = base64
        })
      },

      openDeleteDialog(index , deleteId){
        this.btnLoader = false;
        this.selectedIndex= index;
        this.selectedId= deleteId;
        this.deleteDocumentDialog= true;
      },

      deleteDocument(){
        this.registryDocFile.splice(this.selectedIndex , 1);
        this.documentAttachment= this.registryDocFile;
        this.deleteDocumentDialog= false;
      },

      async getAttachmentDetails(selectedAttachment){
        for(let item of selectedAttachment){
          try {
            this.readerFile = await this.handleUpload(item);
          } catch (e) {
            console.log(e);
          }
          let obj= {};
          let name='';
          name= item.name.split('.');
          obj.format= item.name.substr(item.name.lastIndexOf('.') + 1);
          obj.name= name[0];
          obj.base64= this.readerFile;
          this.tempAttachmentChanged.push(obj)
        }
      },

      getBinaryFile(attachment) {
        let fileUrl = '/file/' + attachment.file.url;
        window.open(process.env.apiBaseUrl +fileUrl );
      },

      getShowDetailState(index){
        this.showDetailState[index]= !this.showDetailState[index];
        console.log('showDetailState' + JSON.stringify(this.showDetailState));
      },

      destroyFileUploader(){
        this.documentAttachmentAPI = [];
        this.documentAttachment = [];
        this.registryDocFile= [];
        this.tempAttachment = [];
      },
    },
  };
</script>
