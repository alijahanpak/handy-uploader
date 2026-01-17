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
          class="mx-auto"
          max-width="344"
        >
          <!-- Image Preview Section -->
          <template v-if="isImageFile(attachment.file.name)">
            <div style="height: 200px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; overflow: hidden;">
              <img
                :src="getImageSrc(attachment.file)"
                style="max-width: 100%; max-height: 100%; object-fit: contain;"
                @error="onImageError(attachment.file)"
              />
            </div>
          </template>

          <!-- Video Preview Section -->
          <template v-else-if="isVideoFile(attachment.file.name)">
            <div style="height: 200px; background-color: #f5f5f5; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              <img 
                v-if="getVideoThumbnail(attachment.file)"
                :src="getVideoThumbnail(attachment.file)" 
                style="width: 100%; height: 100%; object-fit: cover;"
                @error="onVideoThumbnailError(attachment.file)"
              />
              <div v-else style="width: 100%; height: 100%; background: #e0e0e0; display: flex; align-items: center; justify-content: center;">
                <v-icon size="60" color="grey">mdi-video</v-icon>
              </div>
              <div class="d-flex justify-center align-center" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); border-radius: 50%; width: 60px; height: 60px; cursor: pointer;">
                <v-icon color="white" size="30">mdi-play</v-icon>
              </div>
            </div>
          </template>

          <!-- File Details Section -->
          <template v-else>
            <div class="d-flex justify-center align-center" style="height: 200px; background-color: #f5f5f5;">
              <v-icon
                size="120"
                :color="getFileIconProps(attachment.file.name).color"
              >
                {{ getFileIconProps(attachment.file.name).icon }}
              </v-icon>
            </div>
          </template>

          <!-- File Name Section (moved above file size) -->
          <v-card-subtitle class="text-truncate py-2">
            {{ attachment.file.name }}
          </v-card-subtitle>

          <!-- File Size Section -->
          <v-card-subtitle class="pt-2 pb-3">
            <v-chip :color="formatFileSize(attachment.file.size).color" label text-color="white">
              {{ formatFileSize(attachment.file.size).text }}
              <v-icon right>mdi-harddisk</v-icon>
            </v-chip>
          </v-card-subtitle>

          <v-divider class="mx-4" />

          <!-- Actions Section -->
          <v-card-actions style="padding: 0">
            <v-tooltip right>
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  v-if="deletePermission"
                  text
                  fab
                  v-bind="tooltip"
                  @click="handleDelete(index, '')"
                >
                  <v-icon color="red">mdi-trash-can-outline</v-icon>
                </v-btn>
              </template>
              <span class="BYekan">{{ selectedLang[lang].delete }}</span>
            </v-tooltip>

            <v-tooltip right>
              <template v-slot:activator="{ props: tooltip }">
                <v-btn
                  v-if="editPermission"
                  text
                  fab
                  v-bind="tooltip"
                  @click="handleEdit(attachment, index)"
                >
                  <v-icon color="green">mdi-pencil-outline</v-icon>
                </v-btn>
              </template>
              <span class="BYekan">{{ selectedLang[lang].edit }}</span>
            </v-tooltip>

            <v-spacer />

            <!-- Expand Details Button -->
            <v-btn
              v-if="hasDetails(attachment.file)"
              icon
              @click="toggleDetails(attachment.file)"
            >
              <v-icon>
                {{ attachment.file.showDetailState ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Expandable Details Section -->
          <v-expand-transition>
            <div v-if="hasDetails(attachment.file)" v-show="attachment.file.showDetailState">
              <v-divider />

              <!-- Tags -->
              <v-chip-group
                v-if="attachment.file.tags.length"
                multiple
                active-class="primary--text"
                class="pa-2"
              >
                <v-chip
                  v-for="(tag, tagIndex) in attachment.file.tags"
                  :key="`tag-${tagIndex}`"
                  class="ma-1"
                >
                  {{ tag }}
                </v-chip>
              </v-chip-group>

              <!-- Description -->
              <v-card-text
                v-if="attachment.file.description"
                class="text-justify"
              >
                {{ attachment.file.description }}
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick, triggerRef, reactive } from "vue";
import SelectFileIconType from "./SelectFileIconType.vue";
import type { 
  DocumentAttachment, 
  BaseUploaderProps, 
  CardThemeProps,
  UploaderEvents,
  LanguageCode 
} from "@/types";
import { formatFileSize, getFileIconName, getFileIconColor, isImageFile as isImageFileUtil, constructImageDataUrl, getFileType, getMimeTypeFromExtension } from "@/utils/fileUtils";

// Wrapper with debug logging
const isImageFile = (fileName: string): boolean => {
  const result = isImageFileUtil(fileName);
  console.log('🔍 isImageFile check:', fileName, '→', result);
  return result;
};

interface Props extends BaseUploaderProps, CardThemeProps {
  lang: LanguageCode;
}

const props = withDefaults(defineProps<Props>(), {
  thumb: true,
  lang: 'en',
  cols: 4,
  editPermission: true,
  deletePermission: true,
  outlined: false,
  raised: false,
  shaped: false,
  tile: false,
});

const emit = defineEmits<{
  (e: 'openDeleteDialog', index: number, deleteId: string): void;
  (e: 'openEditDocumentDialog', item: DocumentAttachment, index: number): void;
}>();

const getFileTypeIcon = (format: string) => {
  return getFileIconName('file.' + format);
};

const isVideoFile = (fileName: string): boolean => {
  const isVideo = getFileType(fileName) === 'video';
  console.log('🎥 Checking if video file:', fileName, 'result:', isVideo, 'fileType:', getFileType(fileName));
  return isVideo;
};

const getImageSrc = (file: DocumentAttachment['file']): string => {
  if (!file.base64 || !file.format) {
    console.error('❌ Missing base64 or format for:', file.name, { base64: !!file.base64, format: file.format });
    return '';
  }
  const src = constructImageDataUrl(file.base64, file.format);
  console.log('🖼️ Image source for:', file.name, {
    format: file.format,
    base64Length: file.base64?.length || 0,
    srcLength: src.length,
    srcPreview: src.substring(0, 100) + '...'
  });
  return src;
};

const getVideoSrc = (file: DocumentAttachment['file']): string => {
  return constructImageDataUrl(file.base64, file.format);
};

const onImageError = (file: DocumentAttachment['file']) => {
  console.error('Image failed to load:', {
    name: file.name,
    format: file.format,
    base64Length: file.base64?.length || 0
  });
};

const onVideoError = (file: DocumentAttachment['file']) => {
  console.error('Video failed to load:', {
    name: file.name,
    format: file.format,
    base64Length: file.base64?.length || 0
  });
};

// Video thumbnail generation - using reactive Map for better reactivity
const videoThumbnails = reactive(new Map<string, string>());

const generateVideoThumbnail = (file: DocumentAttachment['file']): Promise<string> => {
  console.log('🎬 Starting video thumbnail generation for:', file.name);
  
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('❌ Canvas context not available');
      reject(new Error('Canvas context not available'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true; // Add muted to help with autoplay policies
    
    video.onloadedmetadata = () => {
      console.log('📹 Video metadata loaded:', {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        readyState: video.readyState,
        networkState: video.networkState
      });
      
      if (video.duration === 0 || isNaN(video.duration)) {
        console.error('❌ Invalid video duration:', video.duration);
        const cacheKey = getVideoThumbnailKey(file);
        generatingThumbnails.delete(cacheKey);
        reject(new Error('Invalid video duration'));
        return;
      }
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('❌ Invalid video dimensions:', video.videoWidth, 'x', video.videoHeight);
        const cacheKey = getVideoThumbnailKey(file);
        generatingThumbnails.delete(cacheKey);
        reject(new Error('Invalid video dimensions'));
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to 1 second or 10% of video duration, whichever is smaller
      const seekTime = Math.min(1, video.duration * 0.1);
      console.log('⏰ Seeking to time:', seekTime, 'of total duration:', video.duration);
      video.currentTime = seekTime;
    };
    
    video.onseeked = () => {
      console.log('🎯 Video seeked successfully to:', video.currentTime);
      
      try {
        console.log('🖼️ Canvas setup:', {
          width: canvas.width,
          height: canvas.height,
          videoCurrentTime: video.currentTime,
          videoReadyState: video.readyState
        });
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Check if anything was drawn
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const hasContent = imageData.data.some(pixel => pixel !== 0);
        console.log('🎨 Canvas content check:', hasContent ? 'Has content' : 'Empty/transparent');
        
        // Convert canvas to data URL
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('✅ Generated thumbnail:', {
          dataUrlLength: thumbnailDataUrl.length,
          startsWithData: thumbnailDataUrl.startsWith('data:image/jpeg'),
          preview: thumbnailDataUrl.substring(0, 50) + '...'
        });
        
        resolve(thumbnailDataUrl);
      } catch (error) {
        console.error('❌ Error during thumbnail generation:', error);
        reject(error);
      }
    };
    

    
    video.onabort = () => {
      console.warn('⚠️ Video loading aborted');
      reject(new Error('Video loading aborted'));
    };
    
    video.onstalled = () => {
      console.warn('⚠️ Video loading stalled');
    };
    
    video.onerror = (error) => {
      console.error('❌ Video failed to load for thumbnail generation:', error);
      reject(new Error('Video failed to load for thumbnail generation'));
    };
    
    video.onloadstart = () => {
      console.log('🔄 Video load started');
    };
    
    video.oncanplay = () => {
      console.log('▶️ Video can play');
    };
    
    // Set video source - construct proper video data URL
    const cleanBase64 = file.base64?.replace(/^data:[^;]+;base64,/, '') || '';
    
    // Get proper MIME type from file name or use the format if it's already a MIME type
    let mimeType: string;
    if (file.format.startsWith('video/')) {
      mimeType = file.format;
    } else {
      mimeType = getMimeTypeFromExtension(file.name);
      // Fallback if not a recognized video type
      if (!mimeType.startsWith('video/')) {
        mimeType = `video/${file.format}`;
      }
    }
    
    const videoSrc = `data:${mimeType};base64,${cleanBase64}`;
    console.log('🔗 Setting video source:', {
      fileName: file.name,
      format: file.format,
      mimeType: mimeType,
      base64Length: cleanBase64.length,
      videoSrcLength: videoSrc.length
    });
    video.src = videoSrc;
  });
};

const getVideoThumbnailKey = (file: DocumentAttachment['file']): string => {
  return `${file.name}_${file.base64?.substring(0, 50)}`;
};

// Computed property to get video thumbnail reactively
const getVideoThumbnailSrc = (file: DocumentAttachment['file']): string | undefined => {
  const cacheKey = getVideoThumbnailKey(file);
  const thumbnail = videoThumbnails.get(cacheKey);
  console.log('🔍 Getting thumbnail for:', file.name, 'cached:', !!thumbnail, 'key:', cacheKey);
  return thumbnail && thumbnail !== '' ? thumbnail : undefined;
};

// Create a computed property for each video thumbnail to ensure reactivity
const videoThumbnailsComputed = computed(() => {
  console.log('🔄 Video thumbnails computed updated:', Array.from(videoThumbnails.keys()));
  return videoThumbnails;
});

// Track which thumbnails are being generated to avoid duplicates
const generatingThumbnails = new Set<string>();

const getVideoThumbnail = (file: DocumentAttachment['file']): string | undefined => {
  const cacheKey = getVideoThumbnailKey(file);
  console.log('🔍 Getting video thumbnail for:', file.name, 'cache key:', cacheKey);
  
  // Return cached thumbnail if available
  if (videoThumbnails.has(cacheKey)) {
    console.log('💾 Returning cached thumbnail for:', file.name);
    return videoThumbnails.get(cacheKey);
  }
  
  // Check if already generating to avoid duplicates
  if (generatingThumbnails.has(cacheKey)) {
    console.log('⏳ Thumbnail already being generated for:', file.name);
    return undefined;
  }
  
  console.log('🚀 No cached thumbnail, generating new one for:', file.name);
  generatingThumbnails.add(cacheKey);
  
  // Generate thumbnail asynchronously
  generateVideoThumbnail(file)
    .then(thumbnailUrl => {
      console.log('✅ Thumbnail generated and cached for:', file.name);
      videoThumbnails.set(cacheKey, thumbnailUrl);
      generatingThumbnails.delete(cacheKey);
      // Force UI update
      nextTick(() => {
        console.log('🔄 UI update triggered for:', file.name);
      });
    })
    .catch(error => {
      console.error('❌ Failed to generate video thumbnail for:', file.name, error);
      generatingThumbnails.delete(cacheKey);
      // Don't cache empty results to allow retries
    });
  
  return undefined; // Return undefined initially while generating
};

const onVideoThumbnailError = (file: DocumentAttachment['file']) => {
  console.error('Video thumbnail failed to load:', {
    name: file.name,
    format: file.format
  });
  
  // Remove from cache to allow retry
  const cacheKey = getVideoThumbnailKey(file);
  videoThumbnails.delete(cacheKey);
};

const getFileIconProps = (fileName: string) => {
  return {
    icon: getFileIconName(fileName),
    color: getFileIconColor(fileName)
  };
};

// File size formatter
const getFormattedFileSize = (size: number) => {
  const kbSize = size / 1000;
  if (kbSize < 1024) {
    return {
      text: `${kbSize.toFixed(1)} ${props.selectedLang[props.lang].size.kb}`,
      color: 'teal lighten-2'
    };
  }
  return {
    text: `${(kbSize / 1024).toFixed(1)} ${props.selectedLang[props.lang].size.mb}`,
    color: 'teal lighten-2'
  };
};

// Details handling
const hasDetails = (file: DocumentAttachment['file']): boolean => {
  return file.tags.length > 0 || !!file.description;
};

const toggleDetails = (file: DocumentAttachment['file']) => {
  file.showDetailState = !file.showDetailState;
};

// Event handlers
const handleDelete = (index: number, deleteId: string) => {
  emit('openDeleteDialog', index, deleteId);
};

const handleEdit = (item: DocumentAttachment, index: number) => {
  emit('openEditDocumentDialog', item, index);
};

// Auto-generate video thumbnails
const generateThumbnailsForVideos = () => {
  console.log('🎯 Generating thumbnails for videos, total attachments:', props.documentAttachment.length);
  
  const videoAttachments = props.documentAttachment.filter(attachment => isVideoFile(attachment.file.name));
  console.log('📹 Found video attachments:', videoAttachments.length, videoAttachments.map(a => a.file.name));
  
  videoAttachments.forEach(attachment => {
    console.log('🎬 Processing video:', attachment.file.name);
    getVideoThumbnail(attachment.file);
  });
};

// Watch for changes in documentAttachment to generate thumbnails
watch(() => props.documentAttachment, generateThumbnailsForVideos, { immediate: true });

// Generate thumbnails on mount
onMounted(generateThumbnailsForVideos);
</script>