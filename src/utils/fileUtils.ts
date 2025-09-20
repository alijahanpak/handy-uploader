import type { FileSizeResult, FileIconProps, MimeType } from '../types';

/**
 * Formats file size into human-readable format with appropriate color coding
 */
export function formatFileSize(size: number): FileSizeResult {
  const sizeInKB = size / 1024;
  const sizeInMB = sizeInKB / 1024;

  if (sizeInMB >= 1) {
    return {
      text: `${sizeInMB.toFixed(2)} MB`,
      color: sizeInMB > 10 ? 'red' : sizeInMB > 5 ? 'orange' : 'green'
    };
  } else {
    return {
      text: `${sizeInKB.toFixed(2)} KB`,
      color: sizeInKB > 1000 ? 'orange' : 'green'
    };
  }
}

/**
 * Determines file type based on file extension or MIME type
 */
export function getFileType(fileName: string, mimeType?: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'].includes(extension) ||
      mimeType?.startsWith('image/')) {
    return 'image';
  }
  
  // Document types
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
    return 'document';
  }
  
  // Spreadsheet types
  if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
    return 'spreadsheet';
  }
  
  // Presentation types
  if (['ppt', 'pptx', 'odp'].includes(extension)) {
    return 'presentation';
  }
  
  // Archive types
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'archive';
  }
  
  // Video types
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return 'video';
  }
  
  // Audio types
  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) {
    return 'audio';
  }
  
  return 'file';
}

/**
 * Gets appropriate icon and color for file type
 */
export function getFileIcon(fileName: string, mimeType?: string): FileIconProps {
  const fileType = getFileType(fileName, mimeType);
  
  const iconMap: Record<string, FileIconProps> = {
    image: { icon: 'mdi-file-image', color: 'blue' },
    document: { icon: 'mdi-file-document', color: 'red' },
    spreadsheet: { icon: 'mdi-file-excel', color: 'green' },
    presentation: { icon: 'mdi-file-powerpoint', color: 'orange' },
    archive: { icon: 'mdi-folder-zip', color: 'purple' },
    video: { icon: 'mdi-file-video', color: 'pink' },
    audio: { icon: 'mdi-file-music', color: 'teal' },
    file: { icon: 'mdi-file', color: 'grey' }
  };
  
  return iconMap[fileType] || iconMap.file;
}

/**
 * Checks if file is an image type
 */
export function isImageFile(fileName: string, mimeType?: string): boolean {
  return getFileType(fileName, mimeType) === 'image';
}

/**
 * Validates file size against maximum allowed size
 */
export function validateFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize;
}

/**
 * Validates file count against maximum allowed count
 */
export function validateFileCount(currentCount: number, maxCount: number): boolean {
  return currentCount < maxCount;
}

/**
 * Gets MIME type from file extension
 */
export function getMimeTypeFromExtension(fileName: string): MimeType {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const mimeMap: Record<string, MimeType> = {
    // Image types
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    // Video types
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    // Document types
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'csv': 'text/csv',
    // Archive types
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed'
  };
  
  return mimeMap[extension] || 'application/octet-stream';
}

/**
 * Constructs proper data URL for base64 image data
 */
export function constructImageDataUrl(base64: string, format: string): string {
  // Remove any existing data URL prefix
  const cleanBase64 = base64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
  
  // Determine MIME type
  const mimeType = format.startsWith('image/') ? format : `image/${format}`;
  
  return `data:${mimeType};base64,${cleanBase64}`;
}

/**
 * Compresses image using canvas
 */
export function compressImage(
  file: File, 
  quality: number = 0.8, 
  maxWidth: number = 1920, 
  maxHeight: number = 1080
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Converts file to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get clean base64
      const base64 = result.split(',')[1] || result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}