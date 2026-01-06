# CV Builder - Complete Implementation Plan (Enhanced)

## Project Overview

A privacy-first, client-side CV editor with zero backend. All data lives in the user's browser via localStorage. Professional PDF generation happens entirely in the browser. ATS-friendly (no profile photos).

---

## Tech Stack

| Component | Technology | Reasoning |
|-----------|-----------|-----------|
| Framework | Next.js 16 (App Router) | Static export capability, React ecosystem |
| State Management | Zustand + persist | Simple global state with auto-sync to localStorage |
| PDF Engine | @react-pdf/renderer | Professional PDF generation in browser |
| Drag & Drop | @dnd-kit/core + sortable | Modern, accessible drag-and-drop |
| UI Components | shadcn/ui | Accessible, customizable components |
| Icons | Lucide React | Lightweight SVG icons |
| Styling | Tailwind CSS | Utility-first, matches PDF styling easily |
| File Export | file-saver | Cross-browser file downloads |
| Deployment | Vercel/Netlify | Free static hosting |

---

## Core Data Schema

```typescript
// types/cv.ts

export interface CV {
  id: string;
  title: string;
  templateId: 'classic' | 'modern' | 'minimal';
  lastModified: number; // Unix timestamp
  version: number; // Schema version for migrations
  
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    summary: string; // max 600 chars recommended
  };

  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  
  // Section visibility and ordering
  sectionOrder: ('experience' | 'education' | 'skills')[];
  hiddenSections: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  dateRange: string;
  location: string;
  description: string;
  order: number; // for manual reordering
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  dateRange: string;
  order: number;
}

// Schema migration helper
export const CURRENT_SCHEMA_VERSION = 1;

export const migrateCV = (cv: any): CV => {
  if (cv.version === CURRENT_SCHEMA_VERSION) return cv;
  
  // Migration logic for older versions
  if (!cv.version || cv.version < 1) {
    return {
      ...cv,
      version: 1,
      sectionOrder: cv.sectionOrder || ['experience', 'education', 'skills'],
      hiddenSections: cv.hiddenSections || []
    };
  }
  
  return cv;
};
```

---

## State Management

```typescript
// store/useCVStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CV, migrateCV, CURRENT_SCHEMA_VERSION } from '@/types/cv';

interface CVState {
  cvs: CV[];
  activeCvId: string | null;
  history: CV[][]; // For undo/redo (last 10 states)
  historyIndex: number;
  searchQuery: string;
  sortBy: 'lastModified' | 'title';
  
  // CRUD Operations
  createCV: (title: string) => void;
  duplicateCV: (id: string) => void;
  updateCV: (id: string, data: Partial<CV>) => void;
  deleteCV: (id: string) => void;
  setActiveCV: (id: string) => void;
  
  // Search & Filter
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: 'lastModified' | 'title') => void;
  getFilteredCVs: () => CV[];
  
  // Import/Export
  exportJSON: () => void;
  exportSingleCV: (id: string) => void;
  importJSON: (data: string) => void;
  
  // History Management
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      cvs: [],
      activeCvId: null,
      history: [],
      historyIndex: -1,
      searchQuery: '',
      sortBy: 'lastModified',

      createCV: (title) => set((state) => {
        const newCV: CV = {
          id: uuidv4(),
          title,
          templateId: 'classic',
          lastModified: Date.now(),
          version: CURRENT_SCHEMA_VERSION,
          personalInfo: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            website: '',
            linkedin: '',
            summary: 'Experienced professional with a proven track record in delivering high-quality results. Strong problem-solving skills and ability to work in fast-paced environments.'
          },
          experience: [{
            id: uuidv4(),
            company: 'Tech Corp',
            role: 'Senior Developer',
            dateRange: '2020 - Present',
            location: 'Remote',
            description: 'Led development of key features that improved user engagement by 40%. Mentored junior developers and established coding best practices.',
            order: 0
          }],
          education: [{
            id: uuidv4(),
            institution: 'University Name',
            degree: 'Bachelor of Science in Computer Science',
            dateRange: '2016 - 2020',
            order: 0
          }],
          skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
          sectionOrder: ['experience', 'education', 'skills'],
          hiddenSections: []
        };
        return { 
          cvs: [newCV, ...state.cvs], 
          activeCvId: newCV.id 
        };
      }),

      duplicateCV: (id) => set((state) => {
        const original = state.cvs.find(cv => cv.id === id);
        if (!original) return state;
        
        const duplicate: CV = {
          ...original,
          id: uuidv4(),
          title: `${original.title} (Copy)`,
          lastModified: Date.now(),
          experience: original.experience.map(exp => ({ ...exp, id: uuidv4() })),
          education: original.education.map(edu => ({ ...edu, id: uuidv4() }))
        };
        return { cvs: [duplicate, ...state.cvs] };
      }),

      updateCV: (id, data) => set((state) => {
        const newCVs = state.cvs.map((cv) => 
          cv.id === id ? { ...cv, ...data, lastModified: Date.now() } : cv
        );
        
        // Save to history for undo/redo
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push([...state.cvs]);
        if (newHistory.length > 10) newHistory.shift();
        
        return {
          cvs: newCVs,
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }),

      deleteCV: (id) => set((state) => ({
        cvs: state.cvs.filter((cv) => cv.id !== id),
        activeCvId: state.activeCvId === id ? null : state.activeCvId
      })),

      setActiveCV: (id) => set({ activeCvId: id }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSortBy: (sortBy) => set({ sortBy }),
      
      getFilteredCVs: () => {
        const { cvs, searchQuery, sortBy } = get();
        
        // Filter by search query
        let filtered = cvs;
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = cvs.filter(cv => 
            cv.title.toLowerCase().includes(query) ||
            cv.personalInfo.fullName.toLowerCase().includes(query) ||
            cv.personalInfo.email.toLowerCase().includes(query)
          );
        }
        
        // Sort
        return filtered.sort((a, b) => {
          if (sortBy === 'lastModified') {
            return b.lastModified - a.lastModified;
          } else {
            return a.title.localeCompare(b.title);
          }
        });
      },

      exportJSON: () => {
        const data = JSON.stringify(get().cvs, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv_backup_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
      
      exportSingleCV: (id) => {
        const cv = get().cvs.find(c => c.id === id);
        if (!cv) return;
        
        const data = JSON.stringify(cv, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cv.title.replace(/\s+/g, '_')}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      importJSON: (data) => {
        try {
          const parsed = JSON.parse(data);
          const imported = Array.isArray(parsed) ? parsed : [parsed];
          
          // Migrate each CV to current schema version
          const migratedCVs = imported.map(migrateCV);
          
          set({ cvs: migratedCVs });
        } catch (err) {
          console.error('Invalid JSON');
          throw new Error('Invalid JSON format');
        }
      },

      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          return {
            cvs: state.history[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1
          };
        }
        return state;
      }),

      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          return {
            cvs: state.history[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1
          };
        }
        return state;
      }),

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,
    }),
    {
      name: 'cv-builder-storage',
      storage: createJSONStorage(() => localStorage),
      // Migrate data on load
      migrate: (persistedState: any, version: number) => {
        if (persistedState?.cvs) {
          persistedState.cvs = persistedState.cvs.map(migrateCV);
        }
        return persistedState;
      }
    }
  )
);
```

---

## Template System

### Structure

```
/components/templates
  /Classic
    index.tsx        # HTML preview (Tailwind)
    pdf.tsx          # PDF export (React-PDF)
    thumbnail.tsx    # Small preview image
  /Modern
    index.tsx
    pdf.tsx
    thumbnail.tsx
  /Minimal
    index.tsx
    pdf.tsx
    thumbnail.tsx
  registry.ts        # Central template registry
```

### Template Registry

```typescript
// components/templates/registry.ts
import { ClassicTemplate, ClassicPDF, ClassicThumbnail } from './Classic';
import { ModernTemplate, ModernPDF, ModernThumbnail } from './Modern';
import { MinimalTemplate, MinimalPDF, MinimalThumbnail } from './Minimal';
import { CV } from '@/types/cv';

export interface TemplateConfig {
  name: string;
  description: string;
  preview: React.ComponentType<{ data: CV }>;
  pdf: React.ComponentType<{ data: CV }>;
  thumbnail: React.ComponentType;
}

export const TemplateRegistry: Record<CV['templateId'], TemplateConfig> = {
  classic: {
    name: 'Classic',
    description: 'Traditional format with clear sections',
    preview: ClassicTemplate,
    pdf: ClassicPDF,
    thumbnail: ClassicThumbnail
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary design with accent colors',
    preview: ModernTemplate,
    pdf: ModernPDF,
    thumbnail: ModernThumbnail
  },
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple layout',
    preview: MinimalTemplate,
    pdf: MinimalPDF,
    thumbnail: MinimalThumbnail
  }
};
```

### Example: Classic Template Thumbnail

```tsx
// components/templates/Classic/thumbnail.tsx
export const ClassicThumbnail = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white border border-gray-300 rounded overflow-hidden p-2 text-xs">
      <div className="border-b-2 border-black pb-1 mb-1">
        <div className="h-2 bg-gray-800 w-3/4 mb-0.5"></div>
        <div className="h-1 bg-gray-400 w-full"></div>
      </div>
      <div className="space-y-1">
        <div className="h-1 bg-gray-600 w-1/3"></div>
        <div className="h-1 bg-gray-300 w-full"></div>
        <div className="h-1 bg-gray-300 w-5/6"></div>
      </div>
    </div>
  );
};
```

### Example: Classic PDF Template

```tsx
// components/templates/Classic/pdf.tsx
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { CV } from '@/types/cv';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.5
  },
  header: { 
    fontSize: 24, 
    marginBottom: 5, 
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  subHeader: { 
    fontSize: 11, 
    color: '#666', 
    marginBottom: 15 
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 20,
    color: '#333'
  },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    borderBottom: '2pt solid #000',
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4 
  },
  experienceItem: {
    marginBottom: 12
  },
  companyRole: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2
  },
  dateLocation: {
    fontSize: 9,
    color: '#666',
    marginBottom: 4
  },
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333'
  },
  educationItem: {
    marginBottom: 8
  },
  skills: {
    fontSize: 10,
    lineHeight: 1.6
  }
});

export const ClassicPDF = ({ data }: { data: CV }) => {
  // Filter visible sections based on hiddenSections
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View>
          <Text style={styles.header}>{data.personalInfo.fullName}</Text>
          <Text style={styles.subHeader}>
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.location,
              data.personalInfo.website,
              data.personalInfo.linkedin
            ].filter(Boolean).join(' • ')}
          </Text>
          {data.personalInfo.summary && (
            <Text style={styles.summary}>{data.personalInfo.summary}</Text>
          )}
        </View>

        {/* Render sections in custom order */}
        {visibleSections.map((section) => {
          if (section === 'experience' && data.experience.length > 0) {
            return (
              <View key="experience">
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience
                  .sort((a, b) => a.order - b.order)
                  .map((job) => (
                    <View key={job.id} style={styles.experienceItem}>
                      <Text style={styles.companyRole}>
                        {job.company} — {job.role}
                      </Text>
                      <Text style={styles.dateLocation}>
                        {job.dateRange} • {job.location}
                      </Text>
                      <Text style={styles.description}>{job.description}</Text>
                    </View>
                  ))}
              </View>
            );
          }

          if (section === 'education' && data.education.length > 0) {
            return (
              <View key="education">
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education
                  .sort((a, b) => a.order - b.order)
                  .map((edu) => (
                    <View key={edu.id} style={styles.educationItem}>
                      <View style={styles.row}>
                        <Text style={styles.companyRole}>{edu.institution}</Text>
                        <Text style={styles.dateLocation}>{edu.dateRange}</Text>
                      </View>
                      <Text style={styles.description}>{edu.degree}</Text>
                    </View>
                  ))}
              </View>
            );
          }

          if (section === 'skills' && data.skills.length > 0) {
            return (
              <View key="skills">
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.skills}>{data.skills.join(' • ')}</Text>
              </View>
            );
          }

          return null;
        })}
      </Page>
    </Document>
  );
};
```

### Example: Classic HTML Template

```tsx
// components/templates/Classic/index.tsx
import { CV } from '@/types/cv';

export const ClassicTemplate = ({ data }: { data: CV }) => {
  // Filter visible sections
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <div className="printable-preview p-10 font-sans bg-white">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-1">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          {[
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
            data.personalInfo.website,
            data.personalInfo.linkedin
          ].filter(Boolean).join(' • ')}
        </p>
        {data.personalInfo.summary && (
          <p className="text-sm leading-relaxed text-gray-700">
            {data.personalInfo.summary}
          </p>
        )}
      </div>

      {/* Render sections in custom order */}
      {visibleSections.map((section) => {
        if (section === 'experience' && data.experience.length > 0) {
          return (
            <div key="experience" className="mb-6">
              <h2 className="text-base font-bold uppercase tracking-wide border-b-2 border-black pb-1 mb-3">
                Experience
              </h2>
              {data.experience
                .sort((a, b) => a.order - b.order)
                .map((job) => (
                  <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-sm font-bold">
                        {job.company} — {job.role}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">
                      {job.dateRange} • {job.location}
                    </p>
                    <p className="text-sm leading-relaxed">{job.description}</p>
                  </div>
                ))}
            </div>
          );
        }

        if (section === 'education' && data.education.length > 0) {
          return (
            <div key="education" className="mb-6">
              <h2 className="text-base font-bold uppercase tracking-wide border-b-2 border-black pb-1 mb-3">
                Education
              </h2>
              {data.education
                .sort((a, b) => a.order - b.order)
                .map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-bold">{edu.institution}</h3>
                      <span className="text-xs text-gray-600">{edu.dateRange}</span>
                    </div>
                    <p className="text-sm">{edu.degree}</p>
                  </div>
                ))}
            </div>
          );
        }

        if (section === 'skills' && data.skills.length > 0) {
          return (
            <div key="skills">
              <h2 className="text-base font-bold uppercase tracking-wide border-b-2 border-black pb-1 mb-3">
                Skills
              </h2>
              <p className="text-sm">{data.skills.join(' • ')}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
```

---

## Page Structure

### 1. Dashboard (`app/page.tsx`)

**Features:**
- List all CVs in cards/grid format
- **Search/filter by title, name, or email**
- Sort by: Last Modified (default), Title (A-Z)
- Create New CV button (prominent)
- Import JSON button
- Export All button
- Per CV actions:
  - Edit (navigate to editor)
  - Duplicate
  - **Preview before delete** (modal with CV details)
  - Quick download PDF
  - Export single CV as JSON
- **Skeleton loading states** while reading localStorage
- **Empty state** with call-to-action

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [Logo]  CV Builder      [Import] [+ New CV]│
├─────────────────────────────────────────────┤
│  [🔍 Search CVs...]  [Sort: Last Modified ▼]│
├─────────────────────────────────────────────┤
│  ┌──────────  ┌──────────  ┌──────────      │
│  │ CV Card  │  │ CV Card  │  │ CV Card  │    │
│  │ Title    │  │ Title    │  │ Title    │    │
│  │ Modified │  │ Modified │  │ Modified │    │
│  │ [Actions]│  │ [Actions]│  │ [Actions]│    │
│  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────┘

[Offline Indicator - bottom left]
```

**Empty State:**
```
┌─────────────────────────────────────┐
│         📄                          │
│    No CVs yet                       │
│    Create your first professional   │
│    CV in minutes                    │
│                                     │
│    [+ Create New CV]                │
└─────────────────────────────────────┘
```

**Enhanced Delete Confirmation Modal:**
```
┌─────────────────────────────────────┐
│  ⚠️  Delete CV?                     │
│                                     │
│  Title: "Senior Developer Resume"  │
│  Last modified: 2 hours ago         │
│  Contains: 3 jobs, 2 schools        │
│                                     │
│  This action cannot be undone.      │
│                                     │
│  [Cancel]  [Delete]                 │
└─────────────────────────────────────┘
```

**Skeleton Loader:**
```tsx
// components/CVCardSkeleton.tsx
export const CVCardSkeleton = () => (
  <div className="border rounded-lg p-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="flex gap-2">
      <div className="h-8 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);
```

### 2. Editor (`app/editor/[id]/page.tsx`)

**Layout:** Split-screen (50/50 on desktop, stacked on mobile)

**Header (spans full width):**
```
[← Back]  [CV Title - inline editable]  [Undo] [Redo]  [Download PDF]
                     Saved 3s ago ✓
```

**Left Panel - Form Sections:**

1. **Personal Information**
   - Full Name (required, red border if empty)
   - Email (required, validated with regex)
   - Phone (required)
   - Location
   - Website (optional, URL validated)
   - LinkedIn (optional, URL validated)
   - Summary (textarea with 0/600 counter, orange when >550)

2. **Experience Section**
   - [+ Add Experience] button
   - **Draggable list items** (using @dnd-kit)
   - Each item:
     - Company (required)
     - Role (required)
     - Date Range
     - Location
     - Description (textarea)
     - [🗑️ Delete] icon (with confirm)
     - [⋮⋮] Drag handle

3. **Education Section**
   - [+ Add Education] button
   - **Draggable list items**
   - Each item:
     - Institution
     - Degree
     - Date Range
     - [🗑️ Delete] icon
     - [⋮⋮] Drag handle

4. **Skills Section**
   - Tag-style input (press Enter to add)
   - Display as removable chips
   - Max 20 skills warning

5. **Template Selector**
   - **Grid with thumbnail previews** (3 columns)
   - Shows current selection with checkmark
   - Hover shows template name + description

6. **Section Manager** (NEW)
   - Toggle visibility of sections
   - Drag to reorder sections
   - "Show/Hide Skills", "Show/Hide Education", etc.

**Right Panel - Live Preview:**
```
┌─────────────────────────┐
│                         │
│   A4 Paper Preview      │
│   (210mm × 297mm)       │
│   Scaled to fit         │
│                         │
│   Updates live as       │
│   user types            │
│                         │
│   [Print button]        │
└─────────────────────────┘
```

**Mobile Behavior:**
- Show tabs: "Edit" | "Preview"
- Default to "Edit" tab
- "Preview" shows full-screen preview
- Sticky header with "Download PDF" button
- Show message: "💡 Tip: Use desktop for the best editing experience"

**Keyboard Shortcuts:**
```
Ctrl/Cmd + Z : Undo
Ctrl/Cmd + Shift + Z : Redo
Ctrl/Cmd + S : Download PDF
Ctrl/Cmd + P : Print preview
```

---

## Key Features Implementation

### 1. Drag & Drop Manager

```typescript
// hooks/useDragAndDrop.ts
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const useDragAndDrop = <T extends { id: string; order: number }>(
  items: T[],
  onReorder: (newItems: T[]) => void
) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index
      }));
      
      onReorder(reordered);
    }
  };

  return { sensors, handleDragEnd };
};

// Sortable Item Component
export const SortableItem = ({ 
  id, 
  children 
}: { 
  id: string; 
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
    ,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
          aria-label="Drag to reorder"
        >
          ⋮⋮
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
```

### 2. Array Management Hook

```typescript
// hooks/useArrayManager.ts
import { v4 as uuidv4 } from 'uuid';

export const useArrayManager = <T extends { id: string; order: number }>(
  items: T[],
  onUpdate: (newItems: T[]) => void
) => {
  const add = (newItem: Omit<T, 'id' | 'order'>) => {
    const item = {
      ...newItem,
      id: uuidv4(),
      order: items.length
    } as T;
    onUpdate([...items, item]);
  };

  const remove = (id: string) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const update = (id: string, data: Partial<T>) => {
    onUpdate(
      items.map(item => item.id === id ? { ...item, ...data } : item)
    );
  };

  const reorder = (newItems: T[]) => {
    onUpdate(newItems);
  };

  return { add, remove, update, reorder };
};
```

### 3. Enhanced Template Selector

```tsx
// components/TemplateSelector.tsx
import { TemplateRegistry } from '@/components/templates/registry';
import { CV } from '@/types/cv';
import { Check } from 'lucide-react';

export const TemplateSelector = ({ 
  currentTemplate, 
  onChange 
}: { 
  currentTemplate: CV['templateId'];
  onChange: (id: CV['templateId']) => void;
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Template</label>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(TemplateRegistry).map(([id, template]) => {
          const isSelected = currentTemplate === id;
          
          return (
            <button
              key={id}
              onClick={() => onChange(id as CV['templateId'])}
              className={`
                relative border-2 rounded-lg p-3 hover:border-blue-500 transition-all
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
                hover:shadow-md
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${template.name} template`}
            >
              {/* Thumbnail Preview */}
              <div className="mb-2 overflow-hidden rounded">
                <template.thumbnail />
              </div>
              
              {/* Template Info */}
              <div className="text-left">
                <div className="text-sm font-semibold mb-1">{template.name}</div>
                <div className="text-xs text-gray-600">{template.description}</div>
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
```

### 4. Enhanced Download Button

```tsx
// components/DownloadButton.tsx
'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { CV } from '@/types/cv';
import { TemplateRegistry } from '@/components/templates/registry';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DownloadButton = ({ 
  data, 
  disabled = false 
}: { 
  data: CV;
  disabled?: boolean;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      const PDFComponent = TemplateRegistry[data.templateId].pdf;
      const blob = await pdf(<PDFComponent data={data} />).toBlob();
      const filename = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      saveAs(blob, filename);
      
      toast({
        title: 'PDF Downloaded',
        description: `${filename} has been saved to your device.`,
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={disabled || isGenerating}
      className="gap-2"
      size="default"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </Button>
  );
};
```

### 5. Validation Hook

```typescript
// hooks/useValidation.ts
import { CV } from '@/types/cv';
import { useMemo } from 'react';

export const useValidation = (cv: CV) => {
  const errors = useMemo(() => {
    const err: Record<string, string> = {};

    // Personal Info
    if (!cv.personalInfo.fullName.trim()) {
      err.fullName = 'Name is required';
    }

    if (!cv.personalInfo.email.trim()) {
      err.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.personalInfo.email)) {
      err.email = 'Invalid email format';
    }

    if (!cv.personalInfo.phone.trim()) {
      err.phone = 'Phone is required';
    }
    
    if (!cv.personalInfo.location.trim()) {
      err.location = 'Location is required';
    }

    // URL Validation
    const urlPattern = /^https?:\/\/.+/;
    if (cv.personalInfo.website && !urlPattern.test(cv.personalInfo.website)) {
      err.website = 'Invalid website URL (must start with http:// or https://)';
    }
    if (cv.personalInfo.linkedin && !urlPattern.test(cv.personalInfo.linkedin)) {
      err.linkedin = 'Invalid LinkedIn URL (must start with http:// or https://)';
    }

    // Experience validation
    cv.experience.forEach((exp, index) => {
      if (!exp.company.trim()) {
        err[`experience_${index}_company`] = 'Company name is required';
      }
      if (!exp.role.trim()) {
        err[`experience_${index}_role`] = 'Role is required';
      }
    });

    // Education validation
    cv.education.forEach((edu, index) => {
      if (!edu.institution.trim()) {
        err[`education_${index}_institution`] = 'Institution is required';
      }
      if (!edu.degree.trim()) {
        err[`education_${index}_degree`] = 'Degree is required';
      }
    });

    return err;
  }, [cv]);

  const isValid = Object.keys(errors).length === 0;
  const hasErrors = !isValid;

  return { errors, isValid, hasErrors };
};
```

### 6. Character Counter Component

```tsx
// components/TextareaWithCounter.tsx
import { Textarea } from '@/components/ui/textarea';

export const TextareaWithCounter = ({ 
  value, 
  onChange, 
  maxLength = 600,
  label,
  placeholder,
  error,
  ...props 
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  error?: string;
}) => {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining < 50;
  const isOverLimit = remaining < 0;
  
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Textarea 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`
          ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}
          ${error ? 'border-red-500' : ''}
        `}
        {...props} 
      />
      <div className="flex justify-between items-center">
        {error && <span className="text-sm text-red-600">{error}</span>}
        <span className={`text-sm ml-auto ${
          isOverLimit ? 'text-red-600 font-semibold' : 
          isNearLimit ? 'text-orange-600' : 
          'text-gray-500'
        }`}>
          {value.length}/{maxLength}
          {isNearLimit && !isOverLimit && ' (nearly at limit)'}
          {isOverLimit && ' (over limit!)'}
        </span>
      </div>
    </div>
  );
};
```

### 7. Auto-save Indicator

```tsx
// components/AutoSaveIndicator.tsx
import { useEffect, useState } from 'react';
import { Check, Cloud, CloudOff } from 'lucide-react';

export const AutoSaveIndicator = ({ lastModified }: { lastModified: number }) => {
  const [timeSince, setTimeSince] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(Math.floor((Date.now() - lastModified) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastModified]);

  const getText = () => {
    if (timeSince < 2) return 'Saved just now';
    if (timeSince < 60) return `Saved ${timeSince}s ago`;
    const minutes = Math.floor(timeSince / 60);
    if (minutes === 1) return 'Saved 1m ago';
    if (minutes < 60) return `Saved ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `Saved ${hours}h ago`;
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Check className="w-4 h-4 text-green-600" />
      <span>{getText()}</span>
    </div>
  );
};
```

### 8. Offline Indicator

```tsx
// components/OfflineIndicator.tsx
'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div 
      className={`
        fixed bottom-4 left-4 px-4 py-2 rounded-lg shadow-lg text-sm
        flex items-center gap-2 transition-all duration-300 z-50
        ${isOnline 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }
      `}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="font-medium">All changes saved locally</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="font-medium">Offline - changes still saving</span>
        </>
      )}
    </div>
  );
};
```

### 9. Enhanced Search Component

```tsx
// components/SearchBar.tsx
'use client';

import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search CVs by title, name, or email...'
}: {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
        aria-label="Search CVs"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
```

### 10. Delete Confirmation Modal

```tsx
// components/DeleteConfirmModal.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CV } from '@/types/cv';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({
  open,
  onOpenChange,
  cv,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cv: CV | null;
  onConfirm: () => void;
}) => {
  if (!cv) return null;

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDialogTitle>Delete CV?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <div className="bg-gray-50 p-3 rounded-md space-y-1">
              <div className="font-semibold text-gray-900">"{cv.title}"</div>
              <div className="text-sm text-gray-600">
                Last modified: {timeAgo(cv.lastModified)}
              </div>
              <div className="text-sm text-gray-600">
                Contains: {cv.experience.length} job{cv.experience.length !== 1 ? 's' : ''}, {cv.education.length} school{cv.education.length !== 1 ? 's' : ''}
              </div>
            </div>
            <p className="text-red-600 font-medium">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
```

### 11. Error Boundary

```tsx
// components/ErrorBoundary.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-6 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">
              Something went wrong
            </h2>
            <p className="text-gray-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                variant="default"
              >
                Reload Page
              </Button>
              <Button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                variant="outline"
              >
                Clear Data & Reload
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12. Section Manager Component

```tsx
// components/SectionManager.tsx
import { DndContext, closestCenter } from '@dnd-kit/core';
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
    skills: 'Skills'
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id);
      const newIndex = sectionOrder.indexOf(over.id);
      
      const newOrder = [...sectionOrder];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, active.id);
      
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
```

### 13. Print Stylesheet

```css
/* app/globals.css */

@media print {
  /* Hide everything except the preview */
  body * {
    visibility: hidden;
  }
  
  .printable-preview,
  .printable-preview * {
    visibility: visible;
  }
  
  .printable-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 40px;
    background: white;
  }
  
  /* Remove shadows and borders */
  .printable-preview {
    box-shadow: none !important;
    border: none !important;
  }
  
  /* Page breaks */
  .printable-preview h2 {
    page-break-after: avoid;
  }
  
  .printable-preview .experience-item,
  .printable-preview .education-item {
    page-break-inside: avoid;
  }
}
```

### 14. Keyboard Shortcuts Hook

```typescript
// hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

export const useKeyboardShortcuts = (callbacks: {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      if (!modKey) return;

      // Ctrl/Cmd + Z : Undo
      if (e.key === 'z' && !e.shiftKey && callbacks.onUndo) {
        e.preventDefault();
        callbacks.onUndo();
      }

      // Ctrl/Cmd + Shift + Z : Redo
      if (e.key === 'z' && e.shiftKey && callbacks.onRedo) {
        e.preventDefault();
        callbacks.onRedo();
      }

      // Ctrl/Cmd + S : Save (Download PDF)
      if (e.key === 's' && callbacks.onSave) {
        e.preventDefault();
        callbacks.onSave();
      }

      // Ctrl/Cmd + P : Print
      if (e.key === 'p' && callbacks.onPrint) {
        e.preventDefault();
        callbacks.onPrint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};
```

### 15. Mobile Editor Tabs

```tsx
// components/MobileEditorTabs.tsx
'use client';

import { useState } from 'react';
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
```

### 16. Skills Tag Input

```tsx
// components/SkillsInput.tsx
'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SkillsInput = ({
  skills,
  onChange,
  maxSkills = 20
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
}) => {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    const skill = inputValue.trim();
    if (!skill) return;
    if (skills.includes(skill)) {
      setInputValue('');
      return;
    }
    if (skills.length >= maxSkills) return;
    
    onChange([...skills, skill]);
    setInputValue('');
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Skills ({skills.length}/{maxSkills})
      </label>
      
      {/* Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          disabled={skills.length >= maxSkills}
        />
        <Button
          type="button"
          onClick={addSkill}
          disabled={!inputValue.trim() || skills.length >= maxSkills}
          size="icon"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Skills Display */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg min-h-[60px]">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {skills.length >= maxSkills && (
        <p className="text-sm text-orange-600">
          Maximum {maxSkills} skills reached
        </p>
      )}
    </div>
  );
};
```

---

## Accessibility Checklist

- [ ] All interactive elements have proper ARIA labels
- [ ] Keyboard navigation works for all features
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader announcements for state changes
- [ ] Skip links for main content
- [ ] Semantic HTML throughout
- [ ] Form validation errors are announced
- [ ] Drag handles have proper ARIA attributes

---

## Performance Optimizations

1. **Debounced Auto-save**
```typescript
// hooks/useDebouncedSave.ts
import { useEffect, useRef } from 'react';

export const useDebouncedSave = (
  callback: () => void,
  delay: number = 1000,
  dependencies: any[]
) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, dependencies);
};
```

2. **Lazy Load PDF Generation**
- Only import @react-pdf/renderer when user clicks download
- Use React.lazy() for PDF components

3. **Virtualized Lists** (if user has 50+ CVs)
```bash
npm install react-window
```

---

## Testing Strategy

### Unit Tests
- Zustand store actions
- Validation logic
- Array management utilities
- Date formatting helpers

### Integration Tests
- CV CRUD operations
- Template switching
- PDF generation flow
- Import/Export functionality

### E2E Tests (Playwright)
- Create new CV
- Edit and save CV
- Download PDF
- Delete CV with confirmation
- Search and filter CVs

---

## Deployment Checklist

- [ ] Configure Next.js for static export (`output: 'export'`)
- [ ] Optimize images and fonts
- [ ] Add meta tags and Open Graph
- [ ] Configure CSP headers
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify localStorage limits (10MB typically)
- [ ] Add analytics (privacy-friendly: Plausible/Fathom)
- [ ] Create privacy policy page
- [ ] Add sitemap.xml
- [ ] Configure robots.txt

---

## Future Enhancements

### Phase 2
- [ ] Template customization (colors, fonts, spacing)
- [ ] AI-powered suggestions for bullet points
- [ ] Multiple languages support (i18n)
- [ ] Export to .docx format
- [ ] Export to plain text
- [ ] CV scoring/tips system
- [ ] Version history (beyond undo/redo)

### Phase 3
- [ ] Collaborative editing (using WebRTC)
- [ ] Cloud sync (optional, opt-in)
- [ ] Custom sections (e.g., Publications, Certifications)
- [ ] ATS compatibility checker
- [ ] Cover letter generator
- [ ] LinkedIn import

---

## File Structure

```
cv-builder/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Dashboard
│   ├── editor/
│   │   └── [id]/
│   │       └── page.tsx            # Editor
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn components
│   ├── templates/
│   │   ├── Classic/
│   │   │   ├── index.tsx
│   │   │   ├── pdf.tsx
│   │   │   └── thumbnail.tsx
│   │   ├── Modern/
│   │   ├── Minimal/
│   │   └── registry.ts
│   ├── AutoSaveIndicator.tsx
│   ├── CVCardSkeleton.tsx
│   ├── DeleteConfirmModal.tsx
│   ├── DownloadButton.tsx
│   ├── ErrorBoundary.tsx
│   ├── MobileEditorTabs.tsx
│   ├── OfflineIndicator.tsx
│   ├── SearchBar.tsx
│   ├── SectionManager.tsx
│   ├── SkillsInput.tsx
│   ├── TemplateSelector.tsx
│   └── TextareaWithCounter.tsx
├── hooks/
│   ├── useArrayManager.ts
│   ├── useDebouncedSave.ts
│   ├── useDragAndDrop.ts
│   ├── useKeyboardShortcuts.ts
│   └── useValidation.ts
├── store/
│   └── useCVStore.ts
├── types/
│   └── cv.ts
├── lib/
│   └── utils.ts
└── public/
    ├── fonts/
    └── images/
```

---

This comprehensive plan now includes all requested enhancements plus accessibility, error handling, mobile support, keyboard shortcuts, and a clear roadmap for implementation!