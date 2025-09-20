import type { 
  FileUploaderType, 
  CardType, 
  LanguageCode 
} from '../types';

/**
 * Validation utilities for component props
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates file uploader type
 */
export function validateFileUploaderType(value: any): ValidationResult {
  const validTypes: FileUploaderType[] = ['simple', 'thumbnail', 'table'];
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (typeof value !== 'string') {
    result.isValid = false;
    result.errors.push('File uploader type must be a string');
  } else if (!validTypes.includes(value as FileUploaderType)) {
    result.isValid = false;
    result.errors.push(`File uploader type must be one of: ${validTypes.join(', ')}`);
  }

  return result;
}

/**
 * Validates card type
 */
export function validateCardType(value: any): ValidationResult {
  const validTypes: CardType[] = ['default', 'outlined', 'shaped', 'raised', 'tile'];
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (value !== undefined && typeof value !== 'string') {
    result.isValid = false;
    result.errors.push('Card type must be a string');
  } else if (value && !validTypes.includes(value as CardType)) {
    result.isValid = false;
    result.errors.push(`Card type must be one of: ${validTypes.join(', ')}`);
  }

  return result;
}

/**
 * Validates language code
 */
export function validateLanguageCode(value: any): ValidationResult {
  const validCodes: LanguageCode[] = ['en', 'fa', 'fr', 'ch', 'ar'];
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (typeof value !== 'string') {
    result.isValid = false;
    result.errors.push('Language code must be a string');
  } else if (!validCodes.includes(value as LanguageCode)) {
    result.isValid = false;
    result.errors.push(`Language code must be one of: ${validCodes.join(', ')}`);
  }

  return result;
}

/**
 * Validates file size (in bytes)
 */
export function validateFileSize(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (typeof value !== 'number') {
    result.isValid = false;
    result.errors.push('File size must be a number');
  } else if (value <= 0) {
    result.isValid = false;
    result.errors.push('File size must be greater than 0');
  } else if (value > 100 * 1024 * 1024) { // 100MB
    result.warnings.push('File size limit is very large (>100MB), consider reducing for better performance');
  }

  return result;
}

/**
 * Validates file count
 */
export function validateFileCount(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (typeof value !== 'number') {
    result.isValid = false;
    result.errors.push('File count must be a number');
  } else if (value < 0) {
    result.isValid = false;
    result.errors.push('File count cannot be negative');
  } else if (value > 100) {
    result.warnings.push('File count limit is very high (>100), consider reducing for better performance');
  }

  return result;
}

/**
 * Validates image compression level
 */
export function validateCompressionLevel(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (typeof value !== 'number') {
    result.isValid = false;
    result.errors.push('Compression level must be a number');
  } else if (value < 0 || value > 1) {
    result.isValid = false;
    result.errors.push('Compression level must be between 0 and 1');
  } else if (value < 0.1) {
    result.warnings.push('Very low compression level may result in poor image quality');
  } else if (value > 0.9) {
    result.warnings.push('Very high compression level may not reduce file size significantly');
  }

  return result;
}

/**
 * Validates file accept pattern
 */
export function validateFileAccept(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (value !== undefined && typeof value !== 'string') {
    result.isValid = false;
    result.errors.push('File accept pattern must be a string');
  } else if (value && value.trim() === '') {
    result.warnings.push('Empty file accept pattern will accept all files');
  }

  return result;
}

/**
 * Validates columns count for grid layout
 */
export function validateColumns(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (typeof value !== 'number') {
    result.isValid = false;
    result.errors.push('Columns count must be a number');
  } else if (value < 1 || value > 12) {
    result.isValid = false;
    result.errors.push('Columns count must be between 1 and 12');
  }

  return result;
}

/**
 * Validates table height
 */
export function validateTableHeight(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (value !== undefined && typeof value !== 'number') {
    result.isValid = false;
    result.errors.push('Table height must be a number');
  } else if (value && value < 100) {
    result.warnings.push('Table height is very small (<100px), content may not be visible');
  } else if (value && value > 1000) {
    result.warnings.push('Table height is very large (>1000px), consider reducing for better UX');
  }

  return result;
}

/**
 * Validates document attachment array
 */
export function validateDocumentAttachment(value: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  if (!Array.isArray(value)) {
    result.isValid = false;
    result.errors.push('Document attachment must be an array');
    return result;
  }

  // Validate each attachment
  value.forEach((attachment, index) => {
    if (!attachment || typeof attachment !== 'object') {
      result.errors.push(`Attachment at index ${index} must be an object`);
      return;
    }

    if (!attachment.file || typeof attachment.file !== 'object') {
      result.errors.push(`Attachment at index ${index} must have a file property`);
      return;
    }

    const file = attachment.file;
    const requiredFields = ['name', 'format', 'base64', 'size'];
    
    requiredFields.forEach(field => {
      if (!(field in file)) {
        result.errors.push(`File at index ${index} is missing required field: ${field}`);
      }
    });

    // Validate specific fields
    if (file.name && typeof file.name !== 'string') {
      result.errors.push(`File name at index ${index} must be a string`);
    }

    if (file.format && typeof file.format !== 'string') {
      result.errors.push(`File format at index ${index} must be a string`);
    }

    if (file.base64 && typeof file.base64 !== 'string') {
      result.errors.push(`File base64 at index ${index} must be a string`);
    }

    if (file.size && typeof file.size !== 'number') {
      result.errors.push(`File size at index ${index} must be a number`);
    }

    if (file.tags && !Array.isArray(file.tags)) {
      result.errors.push(`File tags at index ${index} must be an array`);
    }
  });

  if (result.errors.length > 0) {
    result.isValid = false;
  }

  return result;
}

/**
 * Comprehensive prop validation for HandyUploader component
 */
export function validateHandyUploaderProps(props: Record<string, any>): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };

  // Validate each prop
  const validations = [
    { key: 'fileUploaderType', validator: validateFileUploaderType },
    { key: 'cardType', validator: validateCardType },
    { key: 'lang', validator: validateLanguageCode },
    { key: 'maxFileSize', validator: validateFileSize },
    { key: 'maxFileCount', validator: validateFileCount },
    { key: 'imageCompressLevel', validator: validateCompressionLevel },
    { key: 'fileAccept', validator: validateFileAccept },
    { key: 'cols', validator: validateColumns },
    { key: 'tableHeight', validator: validateTableHeight },
    { key: 'documentAttachment', validator: validateDocumentAttachment }
  ];

  validations.forEach(({ key, validator }) => {
    if (key in props) {
      const validation = validator(props[key]);
      result.errors.push(...validation.errors.map(error => `${key}: ${error}`));
      result.warnings.push(...validation.warnings.map(warning => `${key}: ${warning}`));
      
      if (!validation.isValid) {
        result.isValid = false;
      }
    }
  });

  return result;
}

/**
 * Creates a prop validator function for Vue components
 */
export function createPropValidator<T>(validator: (value: any) => ValidationResult) {
  return (value: T): boolean => {
    const result = validator(value);
    
    if (!result.isValid) {
      console.error('Prop validation failed:', result.errors);
    }
    
    if (result.warnings.length > 0) {
      console.warn('Prop validation warnings:', result.warnings);
    }
    
    return result.isValid;
  };
}

/**
 * Prop validators for Vue components
 */
export const propValidators = {
  fileUploaderType: createPropValidator(validateFileUploaderType),
  cardType: createPropValidator(validateCardType),
  languageCode: createPropValidator(validateLanguageCode),
  fileSize: createPropValidator(validateFileSize),
  fileCount: createPropValidator(validateFileCount),
  compressionLevel: createPropValidator(validateCompressionLevel),
  fileAccept: createPropValidator(validateFileAccept),
  columns: createPropValidator(validateColumns),
  tableHeight: createPropValidator(validateTableHeight),
  documentAttachment: createPropValidator(validateDocumentAttachment)
};