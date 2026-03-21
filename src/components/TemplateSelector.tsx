// components/TemplateSelector.tsx
import { TemplateRegistry } from "@/components/templates/registry";
import { CV } from "@/types/cv";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const TemplateSelector = ({
  currentTemplate,
  onChange,
}: {
  currentTemplate: CV["templateId"];
  onChange: (id: CV["templateId"]) => void;
}) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h2 className="text-2xl font-serif text-primary">Visual Identity</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Object.entries(TemplateRegistry).map(([id, template]) => {
          const isSelected = currentTemplate === id;

          return (
            <button
              type="button"
              key={id}
              onClick={() => onChange(id as CV["templateId"])}
              className={cn(
                "group relative flex flex-col p-4 rounded-xl transition-all text-left outline-none",
                isSelected 
                  ? "bg-surface-container-lowest shadow-xl shadow-primary/5 ring-2 ring-primary" 
                  : "bg-surface-container-low hover:bg-surface-container hover:translate-y-[-4px]"
              )}
              aria-pressed={isSelected ? "true" : "false"}
              aria-label={`Select ${template.name} template`}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-fade-in">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Thumbnail Preview */}
              <div className="mb-4 aspect-[210/297] overflow-hidden rounded-lg bg-white shadow-inner border border-outline-variant/5">
                <template.thumbnail />
              </div>

              {/* Template Info */}
              <div className="space-y-1">
                <div className={cn(
                  "text-sm font-bold uppercase tracking-widest",
                  isSelected ? "text-primary" : "text-on-surface-variant"
                )}>
                  {template.name}
                </div>
                <div className="text-[10px] text-on-surface-variant/60 leading-relaxed italic">
                  {template.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
