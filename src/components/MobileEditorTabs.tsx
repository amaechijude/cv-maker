'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye } from 'lucide-react';

export const MobileEditorTabs = ({
  editPanel,
  previewPanel
}: {
  editPanel: React.ReactNode;
  previewPanel: React.ReactNode;
}) => {
  return (
    <div className="lg:hidden">
      {/* Mobile tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Use desktop for the best editing experience
        </p>
      </div>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="edit" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-0">
          {editPanel}
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="sticky top-0 bg-white z-10 p-4 border-b">
            <div className="text-sm text-gray-600 text-center">
              A4 Preview (210mm × 297mm)
            </div>
          </div>
          {previewPanel}
        </TabsContent>
      </Tabs>
    </div>
  );
};
