import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/hooks/useDragAndDrop';
import { Switch } from '@/components/ui/switch';
import { CV } from '@/types/cv';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SectionManager = ({
  sectionOrder,
  hiddenSections,
  onReorder,
  onToggleVisibility
}: {
  sectionOrder: CV['sectionOrder'];
  hiddenSections: CV['hiddenSections'];
  onReorder: (newOrder: CV['sectionOrder']) => void;
  onToggleVisibility: (section: string) => void;
}) => {
  const sectionLabels: Record<string, string> = {
    experience: 'Professional Tenure',
    education: 'Academic Foundation',
    skills: 'Core Competencies',
    projects: 'Selected Works',
    certifications: 'Archived Credentials',
    atsKeywords: 'ATS Metadata'
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeId = active.id as CV['sectionOrder'][number];
      const overId = over.id as CV['sectionOrder'][number];
      
      const oldIndex = sectionOrder.indexOf(activeId);
      const newIndex = sectionOrder.indexOf(overId);
      
      const newOrder = [...sectionOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeId);
      
      onReorder(newOrder);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h2 className="text-2xl font-serif text-primary">Archival Structure</h2>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl shadow-inner">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {sectionOrder.map((section) => {
                const isHidden = hiddenSections.includes(section);
                return (
                  <SortableItem key={section} id={section}>
                    <div className={cn(
                      "flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl shadow-sm transition-all group",
                      isHidden && "opacity-50 grayscale"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="cursor-grab active:cursor-grabbing text-on-surface-variant/20 hover:text-primary transition-colors">
                          <GripVertical size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold uppercase tracking-widest text-primary">
                            {sectionLabels[section] || section}
                          </span>
                          <span className="text-[10px] text-on-surface-variant/60 font-medium italic">
                            {isHidden ? "Omitted from manuscript" : "Active entry"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 pr-2">
                        {isHidden ? <EyeOff size={14} className="text-on-surface-variant/40" /> : <Eye size={14} className="text-primary/40" />}
                        <Switch
                          checked={!isHidden}
                          onCheckedChange={() => onToggleVisibility(section)}
                          aria-label={`Toggle ${section} visibility`}
                        />
                      </div>
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      
      <p className="text-[10px] text-on-surface-variant/60 text-center italic">
        Drag and drop to reorder the editorial sequence of your archive.
      </p>
    </section>
  );
};
