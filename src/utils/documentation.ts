import type { 
  FileUploaderType, 
  CardType, 
  LanguageCode,
  DocumentAttachment 
} from '../types';

/**
 * Component documentation and usage examples
 */

export interface PropDocumentation {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description: string;
  examples?: any[];
  validation?: string;
}

export interface ComponentDocumentation {
  name: string;
  description: string;
  props: PropDocumentation[];
  events: EventDocumentation[];
  slots: SlotDocumentation[];
  examples: ComponentExample[];
}

export interface EventDocumentation {
  name: string;
  description: string;
  payload?: string;
  example?: string;
}

export interface SlotDocumentation {
  name: string;
  description: string;
  props?: string;
  example?: string;
}

export interface ComponentExample {
  title: string;
  description: string;
  code: string;
}

/**
 * HandyUploader component documentation
 */
export const handyUploaderDocumentation: ComponentDocumentation = {
  name: 'HandyUploader',
  description: 'A versatile file uploader component with multiple display modes, image compression, and comprehensive file management features.',
  
  props: [
    {
      name: 'fileUploaderType',
      type: 'FileUploaderType',
      required: true,
      description: 'The display mode for the file uploader',
      examples: ['simple', 'thumbnail', 'table'],
      validation: 'Must be one of: simple, thumbnail, table'
    },
    {
      name: 'documentAttachment',
      type: 'DocumentAttachment[]',
      required: true,
      description: 'Array of uploaded files with metadata',
      examples: [[]],
      validation: 'Must be an array of valid DocumentAttachment objects'
    },
    {
      name: 'cardType',
      type: 'CardType',
      required: false,
      default: 'default',
      description: 'Visual style of the card container',
      examples: ['default', 'outlined', 'shaped', 'raised', 'tile'],
      validation: 'Must be one of: default, outlined, shaped, raised, tile'
    },
    {
      name: 'lang',
      type: 'LanguageCode',
      required: false,
      default: 'en',
      description: 'Language for UI text and messages',
      examples: ['en', 'fa', 'fr', 'ch', 'ar'],
      validation: 'Must be one of: en, fa, fr, ch, ar'
    },
    {
      name: 'maxFileSize',
      type: 'number',
      required: false,
      default: 5242880,
      description: 'Maximum file size in bytes (default: 5MB)',
      examples: [1048576, 5242880, 10485760],
      validation: 'Must be a positive number'
    },
    {
      name: 'maxFileCount',
      type: 'number',
      required: false,
      default: 10,
      description: 'Maximum number of files allowed',
      examples: [1, 5, 10, 20],
      validation: 'Must be a non-negative number'
    },
    {
      name: 'imageCompressLevel',
      type: 'number',
      required: false,
      default: 0.8,
      description: 'Image compression quality (0-1, where 1 is highest quality)',
      examples: [0.5, 0.8, 0.9],
      validation: 'Must be between 0 and 1'
    },
    {
      name: 'fileAccept',
      type: 'string',
      required: false,
      description: 'File types to accept (MIME types or extensions)',
      examples: ['image/*', '.pdf,.doc,.docx', 'image/jpeg,image/png'],
      validation: 'Must be a valid MIME type or file extension pattern'
    },
    {
      name: 'cols',
      type: 'number',
      required: false,
      default: 3,
      description: 'Number of columns for thumbnail grid layout',
      examples: [2, 3, 4, 6],
      validation: 'Must be between 1 and 12'
    },
    {
      name: 'tableHeight',
      type: 'number',
      required: false,
      description: 'Height of the table in pixels (for table mode)',
      examples: [300, 400, 500],
      validation: 'Must be a positive number'
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Disables the file uploader',
      examples: [true, false]
    },
    {
      name: 'readonly',
      type: 'boolean',
      required: false,
      default: false,
      description: 'Makes the uploader read-only (no add/delete)',
      examples: [true, false]
    },
    {
      name: 'showProgress',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Shows upload progress indicators',
      examples: [true, false]
    },
    {
      name: 'allowDragDrop',
      type: 'boolean',
      required: false,
      default: true,
      description: 'Enables drag and drop functionality',
      examples: [true, false]
    }
  ],

  events: [
    {
      name: 'update:documentAttachment',
      description: 'Emitted when the document attachment array changes',
      payload: 'DocumentAttachment[]',
      example: '@update:documentAttachment="handleFilesUpdate"'
    },
    {
      name: 'file-added',
      description: 'Emitted when a new file is added',
      payload: 'DocumentAttachment',
      example: '@file-added="handleFileAdded"'
    },
    {
      name: 'file-removed',
      description: 'Emitted when a file is removed',
      payload: 'DocumentAttachment',
      example: '@file-removed="handleFileRemoved"'
    },
    {
      name: 'file-error',
      description: 'Emitted when a file operation fails',
      payload: '{ file: File, error: string }',
      example: '@file-error="handleFileError"'
    },
    {
      name: 'upload-progress',
      description: 'Emitted during file upload progress',
      payload: '{ file: DocumentAttachment, progress: number }',
      example: '@upload-progress="handleUploadProgress"'
    }
  ],

  slots: [
    {
      name: 'default',
      description: 'Custom content to display when no files are uploaded',
      example: '<template #default>Drop files here or click to browse</template>'
    },
    {
      name: 'file-item',
      description: 'Custom template for each file item',
      props: '{ file: DocumentAttachment, index: number }',
      example: '<template #file-item="{ file }">{{ file.file.name }}</template>'
    },
    {
      name: 'actions',
      description: 'Custom action buttons',
      props: '{ files: DocumentAttachment[] }',
      example: '<template #actions="{ files }"><button>Custom Action</button></template>'
    }
  ],

  examples: [
    {
      title: 'Basic Usage',
      description: 'Simple file uploader with default settings',
      code: `<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="simple"
/>`
    },
    {
      title: 'Image Gallery',
      description: 'Thumbnail view for image uploads with compression',
      code: `<HandyUploader
  v-model:documentAttachment="images"
  fileUploaderType="thumbnail"
  fileAccept="image/*"
  :imageCompressLevel="0.7"
  :cols="4"
  :maxFileSize="2097152"
/>`
    },
    {
      title: 'Document Table',
      description: 'Table view for document management',
      code: `<HandyUploader
  v-model:documentAttachment="documents"
  fileUploaderType="table"
  fileAccept=".pdf,.doc,.docx"
  :tableHeight="400"
  :maxFileCount="20"
/>`
    },
    {
      title: 'Multilingual Support',
      description: 'Using different languages',
      code: `<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="simple"
  lang="fa"
/>`
    },
    {
      title: 'Custom Styling',
      description: 'Using different card types and themes',
      code: `<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="thumbnail"
  cardType="outlined"
  cardColor="primary"
  cardVariant="elevated"
/>`
    },
    {
      title: 'Event Handling',
      description: 'Handling file upload events',
      code: `<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="simple"
  @file-added="onFileAdded"
  @file-removed="onFileRemoved"
  @file-error="onFileError"
  @upload-progress="onUploadProgress"
/>

<script setup>
const onFileAdded = (file) => {
  console.log('File added:', file.file.name);
};

const onFileRemoved = (file) => {
  console.log('File removed:', file.file.name);
};

const onFileError = ({ file, error }) => {
  console.error('File error:', error);
};

const onUploadProgress = ({ file, progress }) => {
  console.log(\`Upload progress: \${progress}%\`);
};
</script>`
    },
    {
      title: 'Read-only Mode',
      description: 'Display files without editing capabilities',
      code: `<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="table"
  readonly
/>`
    },
    {
      title: 'Custom Slots',
      description: 'Using custom templates',
      code: `<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="thumbnail"
>
  <template #default>
    <div class="custom-drop-zone">
      <v-icon size="48">mdi-cloud-upload</v-icon>
      <p>Drag and drop your files here</p>
    </div>
  </template>
  
  <template #file-item="{ file, index }">
    <div class="custom-file-item">
      <img :src="file.file.base64" alt="Preview" />
      <p>{{ file.file.name }}</p>
      <small>{{ formatFileSize(file.file.size) }}</small>
    </div>
  </template>
</HandyUploader>`
    }
  ]
};

/**
 * Usage examples for different scenarios
 */
export const usageExamples = {
  /**
   * Basic file upload
   */
  basic: `import { ref } from 'vue';
import HandyUploader from './components/HandyUploader.vue';

const files = ref([]);

// Template
<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="simple"
/>`,

  /**
   * Advanced configuration
   */
  advanced: `import { ref } from 'vue';
import HandyUploader from './components/HandyUploader.vue';

const files = ref([]);

// Template
<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="thumbnail"
  cardType="outlined"
  lang="en"
  :maxFileSize="10485760"
  :maxFileCount="5"
  :imageCompressLevel="0.8"
  fileAccept="image/*"
  :cols="3"
  @file-added="handleFileAdded"
  @file-error="handleFileError"
/>

// Script
const handleFileAdded = (file) => {
  console.log('New file added:', file);
};

const handleFileError = ({ file, error }) => {
  console.error('File upload error:', error);
};`,

  /**
   * TypeScript usage
   */
  typescript: `import { ref } from 'vue';
import type { DocumentAttachment } from './types';
import HandyUploader from './components/HandyUploader.vue';

const files = ref<DocumentAttachment[]>([]);

const handleFilesUpdate = (newFiles: DocumentAttachment[]) => {
  files.value = newFiles;
  // Additional processing...
};

// Template
<HandyUploader
  v-model:documentAttachment="files"
  fileUploaderType="table"
  :tableHeight="400"
  @update:documentAttachment="handleFilesUpdate"
/>`
};

/**
 * Best practices and recommendations
 */
export const bestPractices = {
  performance: [
    'Use appropriate imageCompressLevel (0.7-0.8) for good quality/size balance',
    'Set reasonable maxFileSize limits to prevent memory issues',
    'Limit maxFileCount for better UI performance',
    'Use thumbnail mode for image galleries, table mode for document lists'
  ],
  
  accessibility: [
    'Provide meaningful alt text for images',
    'Use proper ARIA labels for screen readers',
    'Ensure keyboard navigation works properly',
    'Test with screen readers'
  ],
  
  userExperience: [
    'Show clear error messages for file validation failures',
    'Provide upload progress feedback',
    'Use appropriate file type restrictions',
    'Consider drag-and-drop for better usability'
  ],
  
  security: [
    'Always validate file types on the server side',
    'Scan uploaded files for malware',
    'Implement proper file size limits',
    'Sanitize file names before storage'
  ]
};

/**
 * Troubleshooting guide
 */
export const troubleshooting = {
  commonIssues: [
    {
      issue: 'Files not uploading',
      solutions: [
        'Check maxFileSize and maxFileCount limits',
        'Verify fileAccept pattern matches your files',
        'Ensure the component is not disabled or readonly',
        'Check browser console for JavaScript errors'
      ]
    },
    {
      issue: 'Images not compressing',
      solutions: [
        'Verify imageCompressLevel is between 0 and 1',
        'Check that the file is actually an image',
        'Ensure browser supports canvas API',
        'Try different compression levels'
      ]
    },
    {
      issue: 'Styling issues',
      solutions: [
        'Check Vuetify theme configuration',
        'Verify cardType and color props are valid',
        'Ensure CSS classes are not being overridden',
        'Check responsive breakpoints'
      ]
    },
    {
      issue: 'Language not changing',
      solutions: [
        'Verify lang prop is a valid LanguageCode',
        'Check that translation files are loaded',
        'Ensure reactive updates are working',
        'Try reloading the component'
      ]
    }
  ]
};

/**
 * Migration guide for upgrading
 */
export const migrationGuide = {
  fromV1: [
    'Update import paths to use new component structure',
    'Replace old prop names with new TypeScript interfaces',
    'Update event handlers to use new event names',
    'Migrate custom styling to use new theme props'
  ],
  
  breakingChanges: [
    'fileUploaderType is now required',
    'documentAttachment prop structure has changed',
    'Some event names have been updated',
    'CSS classes have been reorganized'
  ]
};

/**
 * Get documentation for a specific component
 */
export function getComponentDocumentation(componentName: string): ComponentDocumentation | null {
  switch (componentName.toLowerCase()) {
    case 'handyuploader':
      return handyUploaderDocumentation;
    default:
      return null;
  }
}

/**
 * Generate prop validation code
 */
export function generatePropValidation(props: PropDocumentation[]): string {
  return props.map(prop => {
    const validator = prop.validation ? `validator: propValidators.${prop.name}` : '';
    const required = prop.required ? 'required: true' : '';
    const defaultValue = prop.default !== undefined ? `default: ${JSON.stringify(prop.default)}` : '';
    
    const options = [required, defaultValue, validator].filter(Boolean).join(', ');
    
    return `${prop.name}: { type: ${prop.type}, ${options} }`;
  }).join(',\n  ');
}

/**
 * Generate TypeScript interface from props
 */
export function generateTypeScriptInterface(componentName: string, props: PropDocumentation[]): string {
  const interfaceName = `${componentName}Props`;
  const propDefinitions = props.map(prop => {
    const optional = prop.required ? '' : '?';
    return `  ${prop.name}${optional}: ${prop.type};`;
  }).join('\n');
  
  return `export interface ${interfaceName} {
${propDefinitions}
}`;
}