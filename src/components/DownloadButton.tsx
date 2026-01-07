'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { CV } from '@/types/cv';
import { TemplateRegistry } from '@/components/templates/registry';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
    
    try {
      const PDFComponent = TemplateRegistry[data.templateId].pdf;
      const blob = await pdf(<PDFComponent data={data} />).toBlob();
      const filename = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      saveAs(blob, filename);
      
      toast.success('PDF Downloaded', {
        description: `${filename} has been saved to your device.`,
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
      toast.error('Generation Failed', {
        description: 'Failed to generate PDF. Please try again.',
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
