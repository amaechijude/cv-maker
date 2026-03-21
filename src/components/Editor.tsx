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
import { Undo, Redo, Trash2, ChevronLeft } from "lucide-react";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { DownloadButton } from "./DownloadButton";
import { ATSKeywordsInput } from "./ATSKeywordsInput";
import { SectionManager } from "./SectionManager";
import { SkillsInput } from "./SkillsInput";
import { TemplateSelector } from "./TemplateSelector";
import { TextareaWithCounter } from "./TextareaWithCounter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { CVDateRangePicker } from "./CVDateRangePicker";
import { MobileEditorTabs } from "./MobileEditorTabs";

interface CvProps {
  cv: CV;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1.5 block">
    {children}
  </label>
);

export function EditorComponent({ cv }: CvProps) {
  const { updateCV, undo, redo, canUndo, canRedo } = useCVStore();
  const router = useRouter();

  const experience = cv.experience.length === 0 ? [] : cv.experience;
  const education = cv.education.length === 0 ? [] : cv.education;
  const id = cv.id;

  const handleUpdate = useCallback(
    (data: Partial<CV>) => {
      updateCV(id, data);
    },
    [id, updateCV]
  );

  const experienceManager = useArrayManager(experience, (newExp) =>
    handleUpdate({ experience: newExp })
  );

  const { sensors: expSensors, handleDragEnd: handleExpDragEnd } =
    useDragAndDrop(experience, experienceManager.reorder);

  const educationManager = useArrayManager(education, (newEdu) =>
    handleUpdate({ education: newEdu })
  );

  const { sensors: eduSensors, handleDragEnd: handleEduDragEnd } =
    useDragAndDrop(education, educationManager.reorder);

  useKeyboardShortcuts({
    onUndo: () => canUndo() && undo(),
    onRedo: () => canRedo() && redo(),
    onSave: () => {},
    onPrint: () => window.print(),
  });

  const PreviewComponent = TemplateRegistry[cv.templateId].preview;


  const editPanel = (
    <div className="space-y-8 md:space-y-12 p-4 md:p-8 lg:p-12 animate-slide-up pb-32">
      {/* Personal Info */}
      <section id="personal-info" className="space-y-6">
        <h2 className="text-2xl md:text-4xl font-serif text-primary">Biographical Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <Label>Full Name</Label>
            <Input
              placeholder="e.g. John Doe"
              value={cv.personalInfo.fullName}
              onChange={(e) =>
                handleUpdate({
                  personalInfo: { ...cv.personalInfo, fullName: e.target.value },
                })
              }
              className="bg-[#1e1c1a] border-[#413c39] h-10 md:h-12"
            />
          </div>
          <div>
            <Label>Professional Email</Label>
            <Input
              type="email"
              placeholder="john.doe@example.com"
              value={cv.personalInfo.email}
              onChange={(e) =>
                handleUpdate({
                  personalInfo: { ...cv.personalInfo, email: e.target.value },
                })
              }
              className="bg-[#1e1c1a] border-[#413c39] h-10 md:h-12"
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              placeholder="+1 (555) 000-0000"
              value={cv.personalInfo.phone}
              onChange={(e) =>
                handleUpdate({
                  personalInfo: { ...cv.personalInfo, phone: e.target.value },
                })
              }
              className="bg-[#1e1c1a] border-[#413c39] h-10 md:h-12"
            />
          </div>
          <div>
            <Label>Current Location</Label>
            <Input
              placeholder="New York, NY"
              value={cv.personalInfo.location}
              onChange={(e) =>
                handleUpdate({
                  personalInfo: { ...cv.personalInfo, location: e.target.value },
                })
              }
              className="bg-[#1e1c1a] border-[#413c39] h-10 md:h-12"
            />
          </div>
        </div>
        <div>
          <Label>Professional Summary</Label>
          <TextareaWithCounter
            placeholder="Experienced professional with a proven track record..."
            value={cv.personalInfo.summary}
            onChange={(e) =>
              handleUpdate({
                personalInfo: { ...cv.personalInfo, summary: e.target.value },
              })
            }
            maxLength={600}
            className="bg-[#1e1c1a] border-[#413c39] min-h-30 md:min-h-40"
          />
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="space-y-6 pt-2 md:pt-4">
        <h2 className="text-2xl md:text-4xl font-serif text-primary">Professional Tenure</h2>
        <Button
            variant="outline"
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
            className="border-primary/40 text-primary hover:bg-primary hover:text-background h-9 md:h-10 px-4 md:px-6 rounded-md w-full md:w-auto"
          >
            Add Entry
          </Button>
        <DndContext
          sensors={expSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleExpDragEnd}
        >
          <SortableContext
            items={cv.experience.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4 md:space-y-6">
              {cv.experience.map((exp) => (
                <SortableItem key={exp.id} id={exp.id}>
                  <div className="group bg-[#2d2a26] p-4 md:p-6 rounded-xl relative border border-outline-variant/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Organization / Company"
                        value={exp.company}
                        onChange={(e) =>
                          experienceManager.update(exp.id, {
                            company: e.target.value,
                          })
                        }
                        className="bg-[#1e1c1a] border-[#413c39]"
                      />
                      <Input
                        placeholder="Official Role"
                        value={exp.role}
                        onChange={(e) =>
                          experienceManager.update(exp.id, { role: e.target.value })
                        }
                        className="bg-[#1e1c1a] border-[#413c39]"
                      />
                      <CVDateRangePicker
                        startDate={exp.startDate}
                        endDate={exp.endDate}
                        onChange={(updates) => experienceManager.update(exp.id, updates)}
                      />
                      <div className="flex gap-2 items-center">
                        <Input
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) =>
                            experienceManager.update(exp.id, {
                                location: e.target.value,
                            })
                            }
                            className="bg-[#1e1c1a] border-[#413c39] flex-1"
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10 shrink-0"
                            onClick={() => experienceManager.remove(exp.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="md:col-span-2">
                        <TextareaWithCounter
                          placeholder="Key achievements..."
                          value={exp.description}
                          onChange={(e) =>
                            experienceManager.update(exp.id, {
                              description: e.target.value,
                            })
                          }
                          maxLength={500}
                          className="bg-[#1e1c1a] border-[#413c39]"
                        />
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {/* Education */}
      <section id="education" className="space-y-6 pt-2 md:pt-4">
        <h2 className="text-2xl md:text-4xl font-serif text-primary">Academic Foundation</h2>
        <Button
            variant="outline"
            size="sm"
            onClick={() =>
              educationManager.add({
                institution: "",
                degree: "",
                dateRange: "",
              })
            }
            className="border-primary/40 text-primary hover:bg-primary hover:text-background h-9 md:h-10 px-4 md:px-6 rounded-md w-full md:w-auto"
          >
            Add Entry
          </Button>
        <DndContext
          sensors={eduSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleEduDragEnd}
        >
          <SortableContext
            items={cv.education.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {cv.education.map((edu) => (
                <SortableItem key={edu.id} id={edu.id}>
                  <div className="group bg-[#2d2a26] p-4 md:p-6 rounded-xl border border-outline-variant/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) =>
                          educationManager.update(edu.id, {
                            institution: e.target.value,
                          })
                        }
                        className="bg-[#1e1c1a] border-[#413c39]"
                      />
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) =>
                          educationManager.update(edu.id, {
                            degree: e.target.value,
                          })
                        }
                        className="bg-[#1e1c1a] border-[#413c39]"
                      />
                      <CVDateRangePicker
                        startDate={edu.startDate}
                        endDate={edu.endDate}
                        onChange={(updates) => educationManager.update(edu.id, updates)}
                      />
                      <div className="flex justify-end">
                         <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-400 hover:bg-red-500/10"
                            onClick={() => educationManager.remove(edu.id)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </section>

      {/* Skills & ATS */}
      <div id="skills" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <SkillsInput
          skills={cv.skills}
          onChange={(newSkills) => handleUpdate({ skills: newSkills })}
        />
        <ATSKeywordsInput
          keywords={cv.atsKeywords || []}
          onChange={(newKeywords) => handleUpdate({ atsKeywords: newKeywords })}
        />
      </div>

      {/* Presentation */}
      <section id="presentation" className="space-y-12 pt-12 border-t border-outline-variant/20">
        <TemplateSelector
            currentTemplate={cv.templateId}
            onChange={(templateId) => handleUpdate({ templateId })}
        />
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
      </section>
    </div>
  );

  const previewPanel = (
    <div className="bg-[#1e1c1a] p-6 md:p-12 lg:p-24 overflow-auto flex justify-center items-start min-h-full">
      <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm">
        <div className="printable-preview">
          <PreviewComponent data={cv} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1e1c1a] text-[#f2ebe1] flex flex-col h-screen overflow-hidden">
      {/* Editorial Navigation V2 */}
      <header className="px-4 md:px-8 py-4 md:py-5 flex items-center justify-between border-b border-primary/20 bg-[#1e1c1a] z-50">
        <div className="flex items-center gap-2 md:gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-primary hover:bg-primary/10 px-2 md:px-3"
          >
            <ChevronLeft className="w-5 h-5 mr-0 md:mr-1" />
            <span className="hidden sm:inline">Archive</span>
          </Button>
          <div className="h-8 w-px bg-primary/20 hidden sm:block" />
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-lg md:text-2xl font-serif text-primary leading-none truncate max-w-37.5 md:max-w-none">
              Digital Curator Editor
            </h1>
            <div className="flex items-center gap-1 md:gap-2">
              <span className="text-[8px] md:text-[10px] uppercase tracking-widest text-[#9a9287]">Manuscript:</span>
              <input
                value={cv.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                className="bg-transparent border-none text-[10px] md:text-xs text-[#f2ebe1] focus:outline-none focus:ring-0 p-0 font-medium w-24 md:w-auto"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden lg:block">
            <AutoSaveIndicator lastModified={cv.lastModified} />
          </div>
          <div className="flex gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => undo()}
              disabled={!canUndo()}
              className="text-primary hover:bg-primary/10 w-8 h-8 md:w-10 md:h-10"
            >
              <Undo className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => redo()}
              disabled={!canRedo()}
              className="text-primary hover:bg-primary/10 w-8 h-8 md:w-10 md:h-10"
            >
              <Redo className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </div>
          <DownloadButton data={cv} />
        </div>
      </header>

      {/* Split View Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* SideNavBar NavV2 - Hidden on mobile */}
        <aside className="hidden md:flex w-64 bg-[#1e1c1a] border-r border-primary/10 flex-col p-6 gap-2 transition-all shrink-0">
          <div className="mb-8">
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-4 opacity-60">Segments</h3>
            <nav className="flex flex-col gap-2">
              <a href="#personal-info" className="flex items-center gap-3 px-3 py-2 text-sm text-[#9a9287] hover:text-primary transition-colors group">
                <span className="w-6 text-[10px] font-mono opacity-40 group-hover:opacity-100">01</span>
                Biographical
              </a>
              <a href="#experience" className="flex items-center gap-3 px-3 py-2 text-sm text-[#9a9287] hover:text-primary transition-colors group">
                <span className="w-6 text-[10px] font-mono opacity-40 group-hover:opacity-100">02</span>
                Tenure
              </a>
              <a href="#education" className="flex items-center gap-3 px-3 py-2 text-sm text-[#9a9287] hover:text-primary transition-colors group">
                <span className="w-6 text-[10px] font-mono opacity-40 group-hover:opacity-100">03</span>
                Academic
              </a>
              <a href="#skills" className="flex items-center gap-3 px-3 py-2 text-sm text-[#9a9287] hover:text-primary transition-colors group">
                <span className="w-6 text-[10px] font-mono opacity-40 group-hover:opacity-100">04</span>
                Capabilities
              </a>
              <a href="#presentation" className="flex items-center gap-3 px-3 py-2 text-sm text-[#9a9287] hover:text-primary transition-colors group">
                <span className="w-6 text-[10px] font-mono opacity-40 group-hover:opacity-100">05</span>
                Presentation
              </a>
            </nav>
          </div>
          
          <div className="mt-auto pt-8 border-t border-primary/10">
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-[10px] text-primary leading-relaxed italic">
                &ldquo;Precision is the cornerstone of professional prestige.&rdquo;
              </p>
            </div>
          </div>
        </aside>

        {/* Main Editor View */}
        <div className="hidden md:flex flex-1 overflow-hidden">
            <div className="w-112.5 lg:w-137.5 overflow-y-auto bg-[#1e1c1a] scrollbar-thin scrollbar-thumb-primary/20">
                {editPanel}
            </div>
            
            {/* Vertical Gold Separator */}
            <div className="w-px bg-primary/30 h-full relative shrink-0">
                <div className="absolute top-1/4 bottom-1/4 -left-0.5 w-1 bg-primary rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto bg-[#262321] relative flex flex-col items-center">
                {/* Visual cues for the curator */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-size-[32px_32px]" style={{ backgroundImage: "radial-gradient(#c5a36b_1px,transparent_1px)" }} />
                {previewPanel}
            </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex-1 overflow-y-auto scrollbar-hide">
            <MobileEditorTabs editPanel={editPanel} previewPanel={previewPanel} />
        </div>
      </div>
    </div>
  );
}
