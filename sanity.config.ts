import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import carSchema from './sanity-schemas/car';

export default defineConfig({
  name: 'default',
  title: 'Kroi Auto Center CMS',
  projectId: 'j2t31xge',
  dataset: 'kroi-production',
  
  plugins: [
    structureTool(),
    visionTool(),
  ],
  
  schema: {
    types: [carSchema],
  },
});
