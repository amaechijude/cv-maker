'use client';

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
          templateId: 'minimal',
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
          projects: [{
            id: uuidv4(),
            name: 'Project Alpha',
            description: 'A cutting-edge web application built with Next.js and Tailwind CSS.',
            dateRange: '2023',
            link: 'https://github.com/johndoe/project-alpha',
            order: 0
          }],
          certifications: [{
            id: uuidv4(),
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2022',
            order: 0
          }],
          sectionOrder: ['experience', 'education', 'skills', 'projects', 'certifications'],
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
          education: original.education.map(edu => ({ ...edu, id: uuidv4() })),
          projects: original.projects.map(proj => ({ ...proj, id: uuidv4() })),
          certifications: original.certifications.map(cert => ({ ...cert, id: uuidv4() }))
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
          console.error('Invalid JSON', err);
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
      migrate: (persistedState: unknown) => {
        const state = persistedState as { cvs?: CV[] } | null;
        if (state?.cvs) {
          state.cvs = state.cvs.map(migrateCV);
        }
        return state as CVState;
      }
    }
  )
);
