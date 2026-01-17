import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta = {
  title: 'Introduction/Getting Started',
  parameters: {
    docs: {
      page: () => `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">🚀 Handy Uploader Component Library</h1>
          
          <p style="font-size: 18px; color: #555;">Welcome to the <strong>Handy Uploader</strong> component library documentation! This is a comprehensive Vue 3 file upload solution with TypeScript support, built for modern web applications.</p>
          
          <h2 style="color: #2c3e50; margin-top: 30px;">✨ Features</h2>
          
          <h3 style="color: #34495e;">Multiple Upload Types</h3>
          <ul style="margin-left: 20px;">
            <li><strong>Simple Uploader</strong>: Clean, minimal interface for basic file uploads</li>
            <li><strong>Table Uploader</strong>: Detailed tabular view with sorting and bulk operations</li>
            <li><strong>Thumbnail Uploader</strong>: Grid-based visual preview with drag & drop</li>
            <li><strong>Handy Uploader</strong>: Main component combining all features with extensive customization</li>
          </ul>
          
          <h3 style="color: #34495e;">Core Capabilities</h3>
          <ul style="margin-left: 20px;">
            <li>✅ <strong>Drag & Drop Support</strong>: Intuitive file selection</li>
            <li>✅ <strong>File Validation</strong>: Size and count limits with custom validation</li>
            <li>✅ <strong>Image Compression</strong>: Built-in compression with configurable quality</li>
            <li>✅ <strong>Multiple File Types</strong>: Support for images, documents, videos, and more</li>
            <li>✅ <strong>Internationalization</strong>: Support for English, French, Persian, Chinese, and Arabic</li>
            <li>✅ <strong>RTL Support</strong>: Right-to-left language support</li>
            <li>✅ <strong>File Management</strong>: Add, edit, delete, tag, and describe files</li>
            <li>✅ <strong>Responsive Design</strong>: Works on desktop and mobile devices</li>
          </ul>
          
          <h3 style="color: #34495e;">UI Customization</h3>
          <ul style="margin-left: 20px;">
            <li>🎨 <strong>Card Styles</strong>: Default, outlined, raised, shaped, and tile variants</li>
            <li>🎨 <strong>Themes</strong>: Light and dark mode support via Vuetify</li>
            <li>🎨 <strong>Flexible Layout</strong>: Configurable grid columns and table layouts</li>
            <li>🎨 <strong>Custom Colors</strong>: Customizable button and accent colors</li>
          </ul>
          
          <h2 style="color: #2c3e50; margin-top: 30px;">📚 Component Overview</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">HandyUploader (Main Component)</h3>
            <p>The most versatile component that includes all features and upload types. Perfect for applications that need comprehensive file management.</p>
            <p><strong>Key Props:</strong></p>
            <ul>
              <li><code>fileUploaderType</code>: Choose between 'simple', 'table', or 'thumbnail'</li>
              <li><code>maxFileSize</code>: Set file size limits</li>
              <li><code>maxFileCount</code>: Control number of files</li>
              <li><code>imageCompressor</code>: Enable automatic image compression</li>
              <li><code>lang</code>: Set interface language</li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">ThumbnailUploader</h3>
            <p>Grid-based uploader with visual previews, ideal for image galleries and media management.</p>
            <p><strong>Best For:</strong> Photo galleries, Visual content management, Portfolio uploads</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">TableUploader</h3>
            <p>Detailed tabular interface with sorting and bulk operations, perfect for document management.</p>
            <p><strong>Best For:</strong> Document management systems, File archives, Detailed file information display, Bulk file operations</p>
          </div>
          
          <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">SimpleUploader</h3>
            <p>Clean, minimal interface for basic file upload needs without complex UI elements.</p>
            <p><strong>Best For:</strong> Simple forms, Quick file attachments, Minimal UI requirements, Basic file uploads</p>
          </div>
          
          <h2 style="color: #2c3e50; margin-top: 30px;">🛠️ Installation & Setup</h2>
          
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>npm install handy-uploader</code></pre>
          
          <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; margin-top: 10px;"><code>&lt;template&gt;
  &lt;HandyUploader
    v-model:document-attachment="files"
    :max-file-size="5000000"
    :max-file-count="10"
    file-uploader-type="thumbnail"
    lang="en"
  /&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue'
import { HandyUploader } from 'handy-uploader'

const files = ref([])
&lt;/script&gt;</code></pre>
          
          <h2 style="color: #2c3e50; margin-top: 30px;">🌍 Internationalization</h2>
          <p>The library supports multiple languages out of the box:</p>
          <ul style="margin-left: 20px;">
            <li><strong>English (en)</strong>: Default language</li>
            <li><strong>French (fr)</strong>: Complete French translation</li>
            <li><strong>Persian (fa)</strong>: Persian with RTL support</li>
            <li><strong>Chinese (ch)</strong>: Simplified Chinese</li>
            <li><strong>Arabic (ar)</strong>: Arabic with RTL support</li>
          </ul>
          
          <h2 style="color: #2c3e50; margin-top: 30px;">📖 Story Navigation</h2>
          <p>Explore the components using the sidebar navigation:</p>
          <ol style="margin-left: 20px;">
            <li><strong>Components/HandyUploader</strong> - Main component with all features</li>
            <li><strong>Components/ThumbnailUploader</strong> - Grid-based visual uploader</li>
            <li><strong>Components/TableUploader</strong> - Detailed table interface</li>
            <li><strong>Components/SimpleUploader</strong> - Minimal upload interface</li>
          </ol>
          
          <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3498db;">
            <h3 style="color: #2c3e50; margin-top: 0;">🎮 Interactive Controls</h3>
            <p>Use the <strong>Controls</strong> panel in each story to:</p>
            <ul>
              <li>Modify component properties in real-time</li>
              <li>Test different configurations</li>
              <li>Understand prop relationships</li>
              <li>Experiment with styling options</li>
            </ul>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #2c3e50; margin-top: 0;">🚀 Getting Started</h3>
            <p style="margin-bottom: 0;">Browse the component stories in the sidebar → Use Controls to experiment → Check Docs for API details → Copy examples for your implementation</p>
            <p style="font-size: 24px; margin: 10px 0 0 0;">Happy uploading! 🎉</p>
          </div>
        </div>
      `,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const GettingStarted: Story = {
  render: () => ({
    template: `
      <div style="padding: 20px; text-align: center;">
        <h2 style="color: #2c3e50;">Welcome to Handy Uploader!</h2>
        <p style="color: #555; font-size: 16px;">
          Navigate through the sidebar to explore all the upload components.
        </p>
        <div style="margin-top: 30px;">
          <p style="color: #777;">
            👈 Check out the component stories in the sidebar to get started
          </p>
        </div>
      </div>
    `,
  }),
};