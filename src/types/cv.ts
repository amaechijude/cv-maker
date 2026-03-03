export interface CV {
  id: string;
  title: string;
  templateId: "classic" | "modern" | "minimal" | "professional" | "creative";
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
  projects: Project[];
  certifications: Certification[];
  atsKeywords?: string[];

  // Section visibility and ordering
  sectionOrder: ("experience" | "education" | "skills" | "projects" | "certifications" | "atsKeywords")[];
  hiddenSections: string[];
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  dateRange: string; // Keeping for compatibility and custom text
  startDate?: string; // ISO format
  endDate?: string;   // ISO format, undefined means "Present"
  location: string;
  description: string;
  order: number; // for manual reordering
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  dateRange: string; // Keeping for compatibility and custom text
  startDate?: string;
  endDate?: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  order: number;
}

export interface Certification {
  link: string;
  id: string;
  name: string;
  issuer: string;
  date: string; // ISO or string
  order: number;
}

// Schema migration helper
export const CURRENT_SCHEMA_VERSION = 5;

// Input type for migration - allows legacy CV structures with partial fields
type LegacyCV = Partial<CV> & { id: string };

export const migrateCV = (cv: LegacyCV): CV => {
  // If version is missing or old (0 or undefined), migrate to 1 first
  let migrated = { ...cv } as CV;
  
  if (!migrated.version || migrated.version < 1) {
    migrated = {
      ...migrated,
      version: 1,
      sectionOrder: migrated.sectionOrder || ["experience", "education", "skills"],
      hiddenSections: migrated.hiddenSections || [],
      projects: migrated.projects || [],
      certifications: migrated.certifications || [],
    };
  }

  // Migrate to version 2: Add projects and certifications to sectionOrder if missing
  if (migrated.version < 2) {
    const currentOrder = new Set(migrated.sectionOrder);
    const newOrder = [...migrated.sectionOrder];
    
    if (!currentOrder.has('projects')) newOrder.push('projects');
    if (!currentOrder.has('certifications')) newOrder.push('certifications');

    migrated = {
      ...migrated,
      version: 2,
      sectionOrder: newOrder,
      projects: migrated.projects || [],
      certifications: migrated.certifications || [],
    };
  }

  // Migrate to version 3: Strict check for projects and certifications in sectionOrder
  if (migrated.version < 3) {
    const currentOrder = new Set(migrated.sectionOrder);
    const newOrder = [...migrated.sectionOrder];
    
    if (!currentOrder.has('projects')) newOrder.push('projects');
    if (!currentOrder.has('certifications')) newOrder.push('certifications');

    migrated = {
      ...migrated,
      version: 3,
      sectionOrder: newOrder,
    };
  }

  // Migrate to version 4: Add atsKeywords
  if (migrated.version < 4) {
    migrated = {
      ...migrated,
      version: 4,
      atsKeywords: migrated.atsKeywords || [],
      sectionOrder: [...migrated.sectionOrder],
    };
  }

  // Migrate to version 5: Ensure dates are handled (initial empty states)
  if (migrated.version < 5) {
      migrated = {
          ...migrated,
          version: 5,
          experience: (migrated.experience || []).map(exp => ({ ...exp, dateRange: exp.dateRange || '' })),
          education: (migrated.education || []).map(edu => ({ ...edu, dateRange: edu.dateRange || '' })),
          projects: (migrated.projects || []).map(proj => ({ ...proj, dateRange: proj.dateRange || '' })),
      }
  }

  return migrated;
};
