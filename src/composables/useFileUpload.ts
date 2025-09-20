import { ref, computed, type Ref } from 'vue';
import type { DocumentAttachment, FileData, ProcessedFile, SnackbarConfig } from '../types';
import { 
  formatFileSize, 
  validateFileSize, 
  validateFileCount, 
  isImageFile,
  fileToBase64,
  compressImage,
  getMimeTypeFromExtension
} from '../utils/fileUtils';

export interface UseFileUploadOptions {
  maxFileSize?: number;
  maxFileCount?: number;
  imageCompressor?: boolean;
  imageCompressLevel?: number;
  fileAccept?: string;
}

export function useFileUpload(
  documentAttachment: Ref<DocumentAttachment[]>,
  options: UseFileUploadOptions = {}
) {
  const {
    maxFileSize = 5 * 1024 * 1024, // 5MB default
    maxFileCount = 10,
    imageCompressor = false,
    imageCompressLevel = 0.8,
    fileAccept = '*'
  } = options;

  const isUploading = ref(false);
  const snackbar = ref<SnackbarConfig>({
    show: false,
    text: '',
    color: 'success'
  });

  // Computed properties
  const fileCount = computed(() => documentAttachment.value.length);
  const canAddMoreFiles = computed(() => fileCount.value < maxFileCount);
  const totalSize = computed(() => 
    documentAttachment.value.reduce((sum, doc) => sum + doc.file.size, 0)
  );

  /**
   * Shows snackbar notification
   */
  function showSnackbar(text: string, color: 'success' | 'error' | 'warning' = 'success') {
    snackbar.value = { show: true, text, color };
  }

  /**
   * Validates a single file
   */
  function validateFile(file: File): { valid: boolean; error?: string } {
    if (!validateFileSize(file.size, maxFileSize)) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
      return { 
        valid: false, 
        error: `File size exceeds maximum allowed size of ${maxSizeMB}MB` 
      };
    }

    if (!validateFileCount(fileCount.value, maxFileCount)) {
      return { 
        valid: false, 
        error: `Maximum file count of ${maxFileCount} reached` 
      };
    }

    // Check file type if accept filter is specified
    if (fileAccept !== '*') {
      const acceptedTypes = fileAccept.split(',').map(type => type.trim());
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(acceptType => {
        if (acceptType.startsWith('.')) {
          return acceptType === fileExtension;
        }
        if (acceptType.includes('/*')) {
          return mimeType.startsWith(acceptType.replace('/*', ''));
        }
        return acceptType === mimeType;
      });

      if (!isAccepted) {
        return { 
          valid: false, 
          error: `File type not accepted. Allowed types: ${fileAccept}` 
        };
      }
    }

    return { valid: true };
  }

  /**
   * Processes a file and converts it to the required format
   */
  async function processFile(file: File): Promise<ProcessedFile> {
    let base64: string;
    
    if (imageCompressor && isImageFile(file.name, file.type)) {
      try {
        const compressedDataUrl = await compressImage(file, imageCompressLevel);
        base64 = compressedDataUrl.split(',')[1]; // Remove data URL prefix
      } catch (error) {
        console.warn('Image compression failed, using original file:', error);
        base64 = await fileToBase64(file);
      }
    } else {
      base64 = await fileToBase64(file);
    }

    const sizeInfo = formatFileSize(file.size);
    const format = getMimeTypeFromExtension(file.name);

    return {
      base64,
      size: sizeInfo.text,
      name: file.name,
      tags: [],
      description: '',
      showDetailState: false,
      format
    };
  }

  /**
   * Handles file upload
   */
  async function uploadFiles(files: FileList | File[]): Promise<boolean> {
    if (isUploading.value) return false;

    isUploading.value = true;
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let hasErrors = false;

    // Validate all files first
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        showSnackbar(validation.error!, 'error');
        hasErrors = true;
      }
    }

    if (validFiles.length === 0) {
      isUploading.value = false;
      return false;
    }

    try {
      // Process all valid files
      const processedFiles = await Promise.all(
        validFiles.map(file => processFile(file))
      );

      // Add to document attachment array
      const newAttachments: DocumentAttachment[] = processedFiles.map(processedFile => ({
        file: {
          name: processedFile.name,
          format: processedFile.format,
          base64: processedFile.base64,
          size: validFiles.find(f => f.name === processedFile.name)?.size || 0,
          tags: processedFile.tags,
          description: processedFile.description,
          showDetailState: processedFile.showDetailState
        }
      }));

      documentAttachment.value.push(...newAttachments);

      const successMessage = validFiles.length === 1 
        ? `File "${validFiles[0].name}" uploaded successfully`
        : `${validFiles.length} files uploaded successfully`;
      
      showSnackbar(successMessage, 'success');
      
      return true;
    } catch (error) {
      console.error('File upload error:', error);
      showSnackbar('Failed to upload files. Please try again.', 'error');
      return false;
    } finally {
      isUploading.value = false;
    }
  }

  /**
   * Removes a file by index
   */
  function removeFile(index: number): boolean {
    if (index >= 0 && index < documentAttachment.value.length) {
      const removedFile = documentAttachment.value[index];
      documentAttachment.value.splice(index, 1);
      showSnackbar(`File "${removedFile.file.name}" removed`, 'warning');
      return true;
    }
    return false;
  }

  /**
   * Updates file metadata
   */
  function updateFileMetadata(
    index: number, 
    updates: Partial<Pick<FileData, 'name' | 'description' | 'tags'>>
  ): boolean {
    if (index >= 0 && index < documentAttachment.value.length) {
      const file = documentAttachment.value[index].file;
      Object.assign(file, updates);
      showSnackbar('File updated successfully', 'success');
      return true;
    }
    return false;
  }

  /**
   * Clears all files
   */
  function clearAllFiles(): void {
    const count = documentAttachment.value.length;
    documentAttachment.value.splice(0);
    showSnackbar(`${count} files cleared`, 'warning');
  }

  return {
    // State
    isUploading: readonly(isUploading),
    snackbar: readonly(snackbar),
    
    // Computed
    fileCount,
    canAddMoreFiles,
    totalSize,
    
    // Methods
    uploadFiles,
    removeFile,
    updateFileMetadata,
    clearAllFiles,
    validateFile,
    showSnackbar
  };
}

// Helper function to make refs readonly
function readonly<T>(ref: Ref<T>): Readonly<Ref<T>> {
  return ref as Readonly<Ref<T>>;
}