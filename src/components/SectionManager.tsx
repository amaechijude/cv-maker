import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '@/hooks/useDragAndDrop';
import { Switch } from '@/components/ui/switch';
import { CV } from '@/types/cv';

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
  const sectionLabels = {
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    certifications: 'Certifications',
    atsKeywords: 'ATS Keywords (Hidden in PDF)'
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
    <div className="space-y-2">
      <label className="text-sm font-medium">Section Order & Visibility</label>
      <div className="border rounded-lg p-3 space-y-2">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((section) => (
              <SortableItem key={section} id={section}>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">
                    {sectionLabels[section as keyof typeof sectionLabels]}
                  </span>
                  <Switch
                    checked={!hiddenSections.includes(section)}
                    onCheckedChange={() => onToggleVisibility(section)}
                    aria-label={`Toggle ${section} visibility`}
                  />
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
