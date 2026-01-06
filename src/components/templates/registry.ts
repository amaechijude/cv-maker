// components/templates/registry.ts
import { ClassicTemplate } from './Classic';
import { ClassicPDF } from './Classic/pdf';
import { ClassicThumbnail } from './Classic/thumbnail';
import { ModernTemplate } from './Modern';
import { ModernPDF } from './Modern/pdf';
import { ModernThumbnail } from './Modern/thumbnail';
import { MinimalTemplate } from './Minimal';
import { MinimalPDF } from './Minimal/pdf';
import { MinimalThumbnail } from './Minimal/thumbnail';
import { CV } from '@/types/cv';

export interface TemplateConfig {
  name: string;
  description: string;
  preview: React.ComponentType<{ data: CV }>;
  pdf: React.ComponentType<{ data: CV }>;
  thumbnail: React.ComponentType;
}

export const TemplateRegistry: Record<CV['templateId'], TemplateConfig> = {
  classic: {
    name: 'Classic',
    description: 'Traditional format with clear sections',
    preview: ClassicTemplate,
    pdf: ClassicPDF,
    thumbnail: ClassicThumbnail
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary design with accent colors',
    preview: ModernTemplate,
    pdf: ModernPDF,
    thumbnail: ModernThumbnail
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple layout',
    preview: MinimalTemplate,
    pdf: MinimalPDF,
    thumbnail: MinimalThumbnail
  }
};
