'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
// import { saveAs } from 'file-saver';
import { CV } from '@/types/cv';
import { TemplateRegistry } from '@/components/templates/registry';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import saveAs from 'file-saver';

export const DownloadButton = ({ 
  data, 
  disabled = false 
}: { 
  data: CV;
  disabled?: boolean;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    console.log('Starting PDF download process...');
    console.log('CV Data:', {
        id: data.id,
        templateId: data.templateId,
        sections: data.sectionOrder
    });
    
    try {
      if (!data.templateId) {
          throw new Error('Template ID is missing');
      }

      console.log('Looking up template:', data.templateId);
      const templateConfig = TemplateRegistry[data.templateId];
      
      if (!templateConfig) {
          console.error('Template registry entry not found for:', data.templateId);
          console.log('Available templates:', Object.keys(TemplateRegistry));
          throw new Error(`Template not found: ${data.templateId}`);
      }

      const PDFComponent = templateConfig.pdf;
      if (!PDFComponent) {
          throw new Error(`PDF Component missing for template: ${data.templateId}`);
      }
      
      console.log('Generating PDF blob...');
      const blob = await pdf(<PDFComponent data={data} />).toBlob();
      console.log('Blob generated, size:', blob.size);
      
      const filename = `${data.personalInfo.fullName} ${data.title}.pdf`;
      
      console.log('Saving file as:', filename);
      saveAs(blob, filename);
      
      toast.success('PDF Downloaded', {
        description: `${filename} has been saved to your device.`,
      });
    } catch (err) {
      console.error('PDF Generation failed detailed error:', err);
      toast.error('Generation Failed', {
        description: err instanceof Error ? err.message : 'Failed to generate PDF. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={disabled || isGenerating}
      className="gap-2 cursor-pointer"
      size="default"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </Button>
  );
};
