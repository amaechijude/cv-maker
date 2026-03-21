'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const MobileEditorTabs = ({
  editPanel,
  previewPanel
}: {
  editPanel: React.ReactNode;
  previewPanel: React.ReactNode;
}) => {
  return (
    <div className="md:hidden animate-fade-in">
      {/* Archival Tip */}
      <div className="mx-6 mt-6 p-4 bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl flex gap-3 items-start">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-primary leading-relaxed italic">
          <strong>Curator's Note:</strong> For the most precise editorial control, we recommend the expanded desktop workspace.
        </p>
      </div>

      <Tabs defaultValue="edit" className="w-full mt-4">
        <div className="sticky top-[73px] z-40 bg-background/80 backdrop-blur-md px-6 py-4 border-b border-primary/10">
          <TabsList className="grid w-full grid-cols-2 bg-surface-container-low p-1 rounded-xl h-12">
            <TabsTrigger 
              value="edit" 
              className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-lg transition-all"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-black">Manuscript</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-background data-[state=active]:shadow-lg transition-all"
            >
              <Eye className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-black">Archive View</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="mt-0 focus-visible:outline-none">
          {editPanel}
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0 focus-visible:outline-none bg-[#262321] min-h-screen">
          <div className="p-4 flex justify-center">
            <Badge variant="outline" className="text-[8px] uppercase tracking-[0.3em] font-black border-primary/20 text-primary/60 bg-background/50">
              Archival Preview
            </Badge>
          </div>
          <div className="px-4 pb-24 overflow-x-hidden">
            <div className="scale-[0.85] origin-top shadow-2xl transition-transform duration-500">
              {previewPanel}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
