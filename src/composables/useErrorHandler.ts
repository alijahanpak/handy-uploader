import { ref, reactive } from 'vue';

export interface ErrorInfo {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  context?: Record<string, any>;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface ErrorHandlerOptions {
  maxErrors?: number;
  autoRemoveTimeout?: number;
  logToConsole?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    maxErrors = 10,
    autoRemoveTimeout = 5000,
    logToConsole = true
  } = options;

  const errors = ref<ErrorInfo[]>([]);
  const isLoading = ref(false);

  /**
   * Generates a unique ID for errors
   */
  function generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Adds a new error to the collection
   */
  function addError(
    message: string,
    type: ErrorInfo['type'] = 'error',
    context?: Record<string, any>,
    action?: ErrorInfo['action']
  ): string {
    const errorInfo: ErrorInfo = {
      id: generateId(),
      message,
      type,
      timestamp: new Date(),
      context,
      action
    };

    // Log to console if enabled
    if (logToConsole) {
      const logMethod = type === 'error' ? console.error : 
                      type === 'warning' ? console.warn : 
                      type === 'info' ? console.info : console.log;
      
      logMethod(`[${type.toUpperCase()}] ${message}`, context || '');
    }

    // Add to errors array
    errors.value.unshift(errorInfo);

    // Maintain max errors limit
    if (errors.value.length > maxErrors) {
      errors.value = errors.value.slice(0, maxErrors);
    }

    // Auto-remove after timeout
    if (autoRemoveTimeout > 0) {
      setTimeout(() => {
        removeError(errorInfo.id);
      }, autoRemoveTimeout);
    }

    return errorInfo.id;
  }

  /**
   * Removes an error by ID
   */
  function removeError(id: string): boolean {
    const index = errors.value.findIndex(error => error.id === id);
    if (index !== -1) {
      errors.value.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clears all errors
   */
  function clearErrors(): void {
    errors.value = [];
  }

  /**
   * Clears errors of a specific type
   */
  function clearErrorsByType(type: ErrorInfo['type']): void {
    errors.value = errors.value.filter(error => error.type !== type);
  }

  /**
   * Handles async operations with error catching
   */
  async function handleAsync<T>(
    operation: () => Promise<T>,
    errorMessage?: string,
    context?: Record<string, any>
  ): Promise<T | null> {
    isLoading.value = true;
    
    try {
      const result = await operation();
      return result;
    } catch (error) {
      const message = errorMessage || 
        (error instanceof Error ? error.message : 'An unexpected error occurred');
      
      addError(message, 'error', {
        ...context,
        originalError: error instanceof Error ? error.message : String(error)
      });
      
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Validates a condition and adds error if false
   */
  function validate(
    condition: boolean,
    message: string,
    context?: Record<string, any>
  ): boolean {
    if (!condition) {
      addError(message, 'error', context);
    }
    return condition;
  }

  /**
   * Shows a success message
   */
  function showSuccess(message: string, context?: Record<string, any>): string {
    return addError(message, 'success', context);
  }

  /**
   * Shows a warning message
   */
  function showWarning(message: string, context?: Record<string, any>): string {
    return addError(message, 'warning', context);
  }

  /**
   * Shows an info message
   */
  function showInfo(message: string, context?: Record<string, any>): string {
    return addError(message, 'info', context);
  }

  /**
   * Gets errors by type
   */
  function getErrorsByType(type: ErrorInfo['type']): ErrorInfo[] {
    return errors.value.filter(error => error.type === type);
  }

  /**
   * Gets the most recent error
   */
  function getLatestError(): ErrorInfo | null {
    return errors.value[0] || null;
  }

  /**
   * Checks if there are any errors of a specific type
   */
  function hasErrors(type?: ErrorInfo['type']): boolean {
    if (type) {
      return errors.value.some(error => error.type === type);
    }
    return errors.value.length > 0;
  }

  /**
   * File upload specific error handlers
   */
  const fileUploadErrors = {
    fileSizeExceeded: (fileName: string, maxSize: number) => 
      addError(
        `File "${fileName}" exceeds maximum size of ${(maxSize / (1024 * 1024)).toFixed(1)}MB`,
        'error',
        { fileName, maxSize, category: 'file-upload' }
      ),

    fileCountExceeded: (maxCount: number) =>
      addError(
        `Maximum file count of ${maxCount} reached`,
        'error',
        { maxCount, category: 'file-upload' }
      ),

    invalidFileType: (fileName: string, allowedTypes: string) =>
      addError(
        `File "${fileName}" type not allowed. Accepted types: ${allowedTypes}`,
        'error',
        { fileName, allowedTypes, category: 'file-upload' }
      ),

    uploadFailed: (fileName: string, reason?: string) =>
      addError(
        `Failed to upload "${fileName}"${reason ? `: ${reason}` : ''}`,
        'error',
        { fileName, reason, category: 'file-upload' }
      ),

    compressionFailed: (fileName: string) =>
      addError(
        `Image compression failed for "${fileName}", using original file`,
        'warning',
        { fileName, category: 'file-upload' }
      )
  };

  return {
    // State
    errors: readonly(errors),
    isLoading: readonly(isLoading),
    
    // Methods
    addError,
    removeError,
    clearErrors,
    clearErrorsByType,
    handleAsync,
    validate,
    showSuccess,
    showWarning,
    showInfo,
    getErrorsByType,
    getLatestError,
    hasErrors,
    
    // File upload specific
    fileUploadErrors
  };
}

// Helper function to make refs readonly
function readonly<T>(ref: any): T {
  return ref as T;
}