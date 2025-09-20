// Core file data structure
export interface FileData {
  name: string;
  format: string;
  base64: string;
  size: number;
  tags: string[];
  description: string | null;
  showDetailState: boolean;
}

// Document attachment wrapper
export interface DocumentAttachment {
  file: FileData;
}

// File upload types
export type FileUploaderType = 'simple' | 'thumbnail' | 'table';
export type CardType = 'default' | 'outlined' | 'shaped' | 'raised' | 'tile';
export type LanguageCode = 'en' | 'fa' | 'fr' | 'ch' | 'ar';

// File size result
export interface FileSizeResult {
  text: string;
  color: string;
}

// File icon properties
export interface FileIconProps {
  icon: string;
  color: string;
}

// Language translation structure (from language.ts)
export interface Translation {
  insertFile: string;
  insertNewFile: string;
  add: string;
  delete: string;
  edit: string;
  deleteDialog: {
    message: string;
    cancel: string;
  };
  table: {
    thumb: string;
    name: string;
    size: string;
    tags?: string;
    action: {
      action: string;
      deleteTooltip: string;
    };
  };
  size: {
    kb: string;
    mb: string;
  };
  maxFileSizeAlert?: string;
  maxFileCountAlert: string;
  fileName: string;
  fileDescription: string;
  fileTags: string;
}

// Language collection
export interface LanguageCollection {
  [key: string]: Translation;
}

// Component props interfaces
export interface BaseUploaderProps {
  documentAttachment: DocumentAttachment[];
  lang?: LanguageCode;
  thumb?: boolean;
  cols?: number;
  editPermission?: boolean;
  deletePermission?: boolean;
  selectedLang: LanguageCollection;
}

export interface CardThemeProps {
  cardType?: CardType;
  outlined?: boolean;
  raised?: boolean;
  shaped?: boolean;
  tile?: boolean;
}

export interface HandyUploaderProps extends BaseUploaderProps, CardThemeProps {
  maxFileSize?: number;
  fileUploaderType?: FileUploaderType;
  maxFileCount?: number;
  badgeCounter?: boolean;
  btnColor?: string;
  imageCompressor?: boolean;
  imageCompressLevel?: number;
  fileAccept?: string;
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
}

// Event emitters
export interface UploaderEvents {
  openDeleteDialog: (index: number, deleteId: string) => void;
  openEditDocumentDialog: (item: DocumentAttachment, index: number) => void;
  setCardTheme?: () => void;
}

export interface HandyUploaderEvents extends UploaderEvents {
  updateCardType: (value: CardType) => void;
  updateBadgeCounter: (value: boolean) => void;
  updateMaxFileCount: (value: number) => void;
  updateMaxFileSize: (value: number) => void;
  updateImageCompressor: (value: boolean) => void;
  updateImageCompressLevel: (value: number) => void;
  updateFileAccept: (value: string) => void;
  updateThumb: (value: boolean) => void;
  updateChangeFileName: (value: boolean) => void;
  updateAddFileDescription: (value: boolean) => void;
  updateTableThumbColumn: (value: boolean) => void;
  updateTableFixedHeader: (value: boolean) => void;
  updateTableHeight: (value: number) => void;
  updateLang: (value: LanguageCode) => void;
  updateDocumentAttachment: (value: DocumentAttachment[]) => void;
}

// Utility types
export type MimeType = 'image/jpeg' | 'image/png' | 'image/tiff' | 'image/bmp' | string;

// File processing result
export interface ProcessedFile {
  base64: string;
  size: string;
  name: string;
  tags: string[];
  description: string;
  showDetailState: boolean;
  format: string;
}

// Snackbar alert configuration
export interface SnackbarConfig {
  show: boolean;
  text: string;
  color: string;
}