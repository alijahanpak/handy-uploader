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
  
  return 'unknown';
}

/**
 * Detailed icon mappings for specific file extensions
 */
const DETAILED_ICON_MAP: Record<string, { icon: string; color: string }> = {
  // PDF
  pdf: { icon: 'mdi-file-pdf-box', color: 'red darken-1' },
  
  // Word Documents
  doc: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
  docx: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
  odt: { icon: 'mdi-file-word-outline', color: 'blue darken-1' },
  
  // Images
  jpg: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  jpeg: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  png: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  gif: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  bmp: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  tif: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  tiff: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  svg: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  webp: { icon: 'mdi-file-image-outline', color: 'deep-purple darken-1' },
  
  // Excel/Spreadsheets
  xls: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
  xlsx: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
  csv: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
  ods: { icon: 'mdi-file-excel-outline', color: 'teal darken-1' },
  
  // PowerPoint/Presentations
  ppt: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  pptx: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  pptm: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  odp: { icon: 'mdi-file-powerpoint-outline', color: 'orange darken-3' },
  
  // Videos
  mp4: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  mov: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  flv: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  wmv: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  avi: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  webm: { icon: 'mdi-file-video-outline', color: 'red lighten-1' },
  
  // Audio
  mp3: { icon: 'mdi-file-music-outline', color: 'purple darken-1' },
  wav: { icon: 'mdi-file-music-outline', color: 'purple darken-1' },
  flac: { icon: 'mdi-file-music-outline', color: 'purple darken-1' },
  aac: { icon: 'mdi-file-music-outline', color: 'purple darken-1' },
  ogg: { icon: 'mdi-file-music-outline', color: 'purple darken-1' },
  
  // CAD
  dwg: { icon: 'mdi-file-cad', color: 'indigo lighten-2' },
  
  // Archives
  zip: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  rar: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  '7z': { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  '7-zip': { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  tar: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  gz: { icon: 'mdi-folder-zip-outline', color: 'lime lighten-1' },
  
  // Text files
  txt: { icon: 'mdi-script-text-outline', color: 'light-green darken-3' },
  rtf: { icon: 'mdi-script-text-outline', color: 'light-green darken-3' },
  
  // Unknown/Default file type
  unknown: { icon: 'mdi-file-question-outline', color: 'grey darken-1' },
};

/**
 * Gets appropriate icon and color for file type (legacy function for backward compatibility)
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
    file: { icon: 'mdi-file', color: 'grey' },
    unknown: { icon: 'mdi-file-question-outline', color: 'grey darken-1' }
  };
  
  return iconMap[fileType] || iconMap.unknown;
}

/**
 * Gets detailed icon and color for specific file extension
 */
export function getDetailedFileIcon(fileName: string): { icon: string; color: string } {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (!extension) {
    return DETAILED_ICON_MAP.unknown;
  }
  
  return DETAILED_ICON_MAP[extension] || DETAILED_ICON_MAP.unknown;
}

/**
 * Gets only the icon name for a file extension
 */
export function getFileIconName(fileName: string): string {
  return getDetailedFileIcon(fileName).icon;
}

/**
 * Gets only the color for a file extension
 */
export function getFileIconColor(fileName: string): string {
  return getDetailedFileIcon(fileName).color;
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
export function constructImageDataUrl(base64: string | undefined, format: string | undefined): string {
  if (!base64 || !format) {
    console.warn('constructImageDataUrl: missing base64 or format', { hasBase64: !!base64, format });
    return '';
  }

  // Remove any existing data URL prefix (handles svg+xml and other formats)
  const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');

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