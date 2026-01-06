// components/TemplateSelector.tsx
import { TemplateRegistry } from "@/components/templates/registry";
import { CV } from "@/types/cv";
import { Check } from "lucide-react";

export const TemplateSelector = ({
  currentTemplate,
  onChange,
}: {
  currentTemplate: CV["templateId"];
  onChange: (id: CV["templateId"]) => void;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Template</label>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(TemplateRegistry).map(([id, template]) => {
          const isSelected = currentTemplate === id;

          return (
            <button
              type="button"
              key={id}
              onClick={() => onChange(id as CV["templateId"])}
              className={`
                relative border-2 rounded-lg p-3 hover:border-blue-500 transition-all
                ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
                hover:shadow-md
              `}
              aria-pressed={isSelected ? "true" : "false"}
              aria-label={`Select ${template.name} template`}
            >
              {/* Thumbnail Preview */}
              <div className="mb-2 overflow-hidden rounded">
                <template.thumbnail />
              </div>

              {/* Template Info */}
              <div className="text-left">
                <div className="text-sm font-semibold mb-1">
                  {template.name}
                </div>
                <div className="text-xs text-gray-600">
                  {template.description}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
