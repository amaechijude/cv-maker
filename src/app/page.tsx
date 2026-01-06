"use client";

import { useState, useEffect } from "react";
import { useCVStore } from "@/store/useCVStore";
import { SearchBar } from "@/components/SearchBar";
import { CVCardSkeleton } from "@/components/CVCardSkeleton";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileDown,
  FileUp,
  Edit,
  Copy,
  Trash2,
  Download,
} from "lucide-react";
import { CV } from "@/types/cv";
import Link from "next/link";
import { toast } from "sonner";

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
    // Simulate loading from localStorage
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const handleCreateCV = () => {
    const title = `Resume ${new Date().toLocaleDateString()}`;
    createCV(title);
    toast.success("CV Created", { description: `Created "${title}"` });
  };

  const handleDuplicate = (id: string) => {
    duplicateCV(id);
    toast.success("CV Duplicated");
  };

  const handleDelete = () => {
    if (deleteCV) {
      removeCVFromStore(deleteCV.id);
      toast.success("CV Deleted");
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
            toast.error("Import Failed", { description: "Invalid JSON file" });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
              <p className="text-sm text-gray-600">
                Create professional CVs in minutes
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleImport}>
                <FileUp className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={exportJSON}>
                <FileDown className="w-4 h-4 mr-2" />
                Export All
              </Button>
              <Button onClick={handleCreateCV}>
                <Plus className="w-4 h-4 mr-2" />
                New CV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
        </div>

        {/* CV Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CVCardSkeleton key={i} />
            ))}
          </div>
        ) : cvs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No CVs found" : "No CVs yet"}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search"
                : "Create your first professional CV in minutes"}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateCV} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Create New CV
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <div
                key={cv.id}
                className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {cv.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  {cv.personalInfo.fullName}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Modified {new Date(cv.lastModified).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/editor/${cv.id}`}>
                    <Button size="sm" variant="default">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicate(cv.id)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportSingleCV(cv.id)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteCV(cv)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deleteCV}
        onOpenChange={(open) => !open && setDeleteCV(null)}
        cv={deleteCV}
        onConfirm={handleDelete}
      />

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}
