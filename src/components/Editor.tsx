"use client";
import { useArrayManager } from "@/hooks/useArrayManager";
import { SortableItem, useDragAndDrop } from "@/hooks/useDragAndDrop";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useCVStore } from "@/store/useCVStore";
import { CV } from "@/types/cv";
import { useCallback } from "react";
import { TemplateRegistry } from "./templates/registry";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Link, ArrowLeft, Undo, Redo } from "lucide-react";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { DownloadButton } from "./DownloadButton";
import { MobileEditorTabs } from "./MobileEditorTabs";
import { SectionManager } from "./SectionManager";
import { SkillsInput } from "./SkillsInput";
import { TemplateSelector } from "./TemplateSelector";
import { TextareaWithCounter } from "./TextareaWithCounter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CvProps {
  cv: CV;
}

export function EditorComponent({ cv }: CvProps) {
  const { updateCV, undo, redo, canUndo, canRedo } = useCVStore();

  // Default values for hooks when cv is undefined
  const experience = cv.experience.length === 0 ? [] : cv.experience;
  const education = cv.education.length === 0 ? [] : cv.education;
  const id = cv.id;

  const handleUpdate = useCallback(
    (data: Partial<CV>) => {
      updateCV(id, data);
    },
    [id, updateCV]
  );

  // Experience array manager - called unconditionally
  const experienceManager = useArrayManager(experience, (newExp) =>
    handleUpdate({ experience: newExp })
  );

  const { sensors: expSensors, handleDragEnd: handleExpDragEnd } =
    useDragAndDrop(experience, experienceManager.reorder);

  // Education array manager - called unconditionally
  const educationManager = useArrayManager(education, (newEdu) =>
    handleUpdate({ education: newEdu })
  );

  const { sensors: eduSensors, handleDragEnd: handleEduDragEnd } =
    useDragAndDrop(education, educationManager.reorder);

  // Keyboard shortcuts - called unconditionally
  useKeyboardShortcuts({
    onUndo: () => canUndo() && undo(),
    onRedo: () => canRedo() && redo(),
    onSave: () => {},
    onPrint: () => window.print(),
  });

  const PreviewComponent = TemplateRegistry[cv.templateId].preview;

  const editPanel = (
    <div className="space-y-6 p-6">
      {/* Personal Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold">Personal Information</h2>
        <Input
          placeholder="Full Name"
          value={cv.personalInfo.fullName}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, fullName: e.target.value },
            })
          }
        />
        <Input
          type="email"
          placeholder="Email"
          value={cv.personalInfo.email}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, email: e.target.value },
            })
          }
        />
        <Input
          placeholder="Phone"
          value={cv.personalInfo.phone}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, phone: e.target.value },
            })
          }
        />
        <Input
          placeholder="Location"
          value={cv.personalInfo.location}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, location: e.target.value },
            })
          }
        />
        <Input
          placeholder="Website (optional)"
          value={cv.personalInfo.website}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, website: e.target.value },
            })
          }
        />
        <Input
          placeholder="LinkedIn (optional)"
          value={cv.personalInfo.linkedin}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, linkedin: e.target.value },
            })
          }
        />
        <TextareaWithCounter
          label="Summary"
          placeholder="Brief professional summary..."
          value={cv.personalInfo.summary}
          onChange={(e) =>
            handleUpdate({
              personalInfo: { ...cv.personalInfo, summary: e.target.value },
            })
          }
          maxLength={600}
        />
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Experience</h2>
          <Button
            size="sm"
            onClick={() =>
              experienceManager.add({
                company: "",
                role: "",
                dateRange: "",
                location: "",
                description: "",
              })
            }
          >
            Add Experience
          </Button>
        </div>
        <DndContext
          sensors={expSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleExpDragEnd}
        >
          <SortableContext
            items={cv.experience.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {cv.experience.map((exp) => (
              <SortableItem key={exp.id} id={exp.id}>
                <div className="border rounded-lg p-4 space-y-2">
                  <Input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      experienceManager.update(exp.id, {
                        company: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) =>
                      experienceManager.update(exp.id, { role: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Date Range (e.g., 2020 - Present)"
                    value={exp.dateRange}
                    onChange={(e) =>
                      experienceManager.update(exp.id, {
                        dateRange: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) =>
                      experienceManager.update(exp.id, {
                        location: e.target.value,
                      })
                    }
                  />
                  <TextareaWithCounter
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) =>
                      experienceManager.update(exp.id, {
                        description: e.target.value,
                      })
                    }
                    maxLength={500}
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => experienceManager.remove(exp.id)}
                  >
                    Delete
                  </Button>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Education</h2>
          <Button
            size="sm"
            onClick={() =>
              educationManager.add({
                institution: "",
                degree: "",
                dateRange: "",
              })
            }
          >
            Add Education
          </Button>
        </div>
        <DndContext
          sensors={eduSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleEduDragEnd}
        >
          <SortableContext
            items={cv.education.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {cv.education.map((edu) => (
              <SortableItem key={edu.id} id={edu.id}>
                <div className="border rounded-lg p-4 space-y-2">
                  <Input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      educationManager.update(edu.id, {
                        institution: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) =>
                      educationManager.update(edu.id, {
                        degree: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Date Range (e.g., 2016 - 2020)"
                    value={edu.dateRange}
                    onChange={(e) =>
                      educationManager.update(edu.id, {
                        dateRange: e.target.value,
                      })
                    }
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => educationManager.remove(edu.id)}
                  >
                    Delete
                  </Button>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Skills */}
      <SkillsInput
        skills={cv.skills}
        onChange={(newSkills) => handleUpdate({ skills: newSkills })}
      />

      {/* Template Selector */}
      <TemplateSelector
        currentTemplate={cv.templateId}
        onChange={(templateId) => handleUpdate({ templateId })}
      />

      {/* Section Manager */}
      <SectionManager
        sectionOrder={cv.sectionOrder}
        hiddenSections={cv.hiddenSections}
        onReorder={(newOrder) => handleUpdate({ sectionOrder: newOrder })}
        onToggleVisibility={(section) => {
          const hidden = cv.hiddenSections.includes(section)
            ? cv.hiddenSections.filter((s) => s !== section)
            : [...cv.hiddenSections, section];
          handleUpdate({ hiddenSections: hidden });
        }}
      />
    </div>
  );

  const previewPanel = (
    <div className="bg-gray-100 p-6 overflow-auto">
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg">
        <PreviewComponent data={cv} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <Input
              value={cv.title}
              onChange={(e) => handleUpdate({ title: e.target.value })}
              className="font-semibold max-w-xs"
            />
          </div>
          <div className="flex items-center gap-4">
            <AutoSaveIndicator lastModified={cv.lastModified} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => undo()}
              disabled={!canUndo()}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => redo()}
              disabled={!canRedo()}
            >
              <Redo className="w-4 h-4" />
            </Button>
            <DownloadButton data={cv} />
          </div>
        </div>
      </header>

      {/* Desktop Split View */}
      <div className="hidden lg:grid lg:grid-cols-2 h-[calc(100vh-64px)]">
        <div className="overflow-auto border-r">{editPanel}</div>
        <div className="overflow-auto">{previewPanel}</div>
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden p-4">
        <MobileEditorTabs editPanel={editPanel} previewPanel={previewPanel} />
      </div>
    </div>
  );
}
