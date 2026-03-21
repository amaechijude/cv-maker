"use client";

import { useState, useEffect } from "react";
import { useCVStore } from "@/store/useCVStore";
import { SearchBar } from "@/components/SearchBar";
import { CVCardSkeleton } from "@/components/CVCardSkeleton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileDown,
  FileUp,
  Edit,
  Copy,
  Trash2,
  Download,
  HelpCircle,
  StickyNote
} from "lucide-react";
import { CV } from "@/types/cv";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [deleteCV, setDeleteCV] = useState<CV | null>(null);

  const {
    createCV,
    duplicateCV,
    deleteCV: removeCVFromStore,
    setSearchQuery,
    searchQuery,
    getFilteredCVs,
    exportJSON,
    exportSingleCV,
    importJSON,
  } = useCVStore();

  const cvs = getFilteredCVs();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleCreateCV = () => {
    const title = `Resume ${new Date().toLocaleDateString()}`;
    createCV(title);
    toast.success("Manuscript Created", { 
      description: `Drafted "${title}"`,
      className: "bg-surface-container-lowest text-primary border-primary/20"
    });
  };

  const handleDuplicate = (id: string) => {
    duplicateCV(id);
    toast.success("Manuscript Duplicated");
  };

  const handleDelete = () => {
    if (deleteCV) {
      removeCVFromStore(deleteCV.id);
      toast.success("Manuscript Deleted");
      setDeleteCV(null);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            importJSON(event.target?.result as string);
            toast.success("Import Successful");
          } catch {
            toast.error("Import Failed");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-16 md:pt-24 pb-12 px-6 overflow-x-hidden">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8 md:mb-12 animate-fade-in max-w-2xl px-4">
        <h1 className="text-5xl md:text-7xl font-serif text-[#f2ebe1] tracking-tight">
          Digital Curator
        </h1>
        <p className="text-lg md:text-xl text-[#9a9287] font-sans font-light">
          Your professional history is not just data—it is a story of precision and prestige.
        </p>
      </div>

      {/* Search & Content Wrapper */}
      <div className="w-full max-w-3xl space-y-6 md:space-y-8 animate-slide-up">
        {/* Search Architecture */}
        <div className="w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            className="w-full"
          />
        </div>

        {/* CV Display Area */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <CVCardSkeleton key={i} />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10">
            <p className="text-[#9a9287] italic">No manuscripts found in the archive.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="group flex flex-col md:flex-row md:items-center justify-between bg-[#2d2a26] p-6 md:p-8 rounded-xl transition-all hover:bg-[#36322f] shadow-sm gap-6"
              >
                <div className="space-y-1">
                  <h3 className="text-2xl md:text-3xl font-serif text-[#f2ebe1] break-words">
                    {cv.title}
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm font-sans text-[#9a9287]">
                      Curator: {cv.personalInfo.fullName || "Anonymous"}
                    </p>
                    <p className="text-[10px] md:text-xs font-sans text-[#9a9287]/60">
                      Archived {new Date(cv.lastModified).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <Link href={`/editor?id=${cv.id}`} className="flex-1 md:flex-none">
                    <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10 rounded-lg w-full md:w-10">
                      <Edit className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDuplicate(cv.id)}
                    className="text-primary hover:bg-primary/10 rounded-lg flex-1 md:flex-none"
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => exportSingleCV(cv.id)}
                    className="text-primary hover:bg-primary/10 rounded-lg flex-1 md:flex-none"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDeleteCV(cv)}
                    className="text-primary hover:bg-red-500/10 hover:text-red-400 rounded-lg flex-1 md:flex-none"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 pt-4 pb-20 md:pb-0">
          <Button 
            onClick={handleCreateCV} 
            variant="outline" 
            className="manuscript-button h-14 px-8 md:px-16 text-lg rounded-xl w-full max-w-sm"
          >
            New Manuscript
          </Button>
          
          <div className="flex gap-3 w-full justify-center">
            <Button variant="ghost" onClick={handleImport} className="h-10 px-4 md:px-6 border border-primary/20 text-primary hover:bg-primary/5 rounded-lg text-[10px] md:text-xs uppercase tracking-widest font-bold">
              <FileUp className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="ghost" onClick={exportJSON} className="h-10 px-4 md:px-6 border border-primary/20 text-primary hover:bg-primary/5 rounded-lg text-[10px] md:text-xs uppercase tracking-widest font-bold">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-6 flex justify-between items-center text-[#9a9287]/40 p-4 md:p-0 bg-background/80 backdrop-blur-sm md:bg-transparent pointer-events-none z-50">
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-sans">
          <StickyNote size={14} className="text-primary/40" />
          <span>Saved Locally</span>
        </div>
        <div className="pointer-events-auto cursor-help">
          <HelpCircle size={24} className="text-primary/20 hover:text-primary/40 transition-colors" />
        </div>
      </footer>

      <DeleteConfirmModal
        open={!!deleteCV}
        onOpenChange={(open) => !open && setDeleteCV(null)}
        cv={deleteCV}
        onConfirm={handleDelete}
      />
    </div>
  );
}
