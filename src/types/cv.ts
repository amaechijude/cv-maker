export interface CV {
  id: string;
  title: string;
  templateId: "classic" | "modern" | "minimal";
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

  // Section visibility and ordering
  sectionOrder: ("experience" | "education" | "skills" | "projects" | "certifications")[];
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

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  dateRange: string;
  order: number;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
  order: number;
}

// Schema migration helper
export const CURRENT_SCHEMA_VERSION = 1;

// Input type for migration - allows legacy CV structures with partial fields
type LegacyCV = Partial<CV> & { id: string };

export const migrateCV = (cv: LegacyCV): CV => {
  if (cv.version === CURRENT_SCHEMA_VERSION) return cv as CV;

  // Migration logic for older versions
  if (!cv.version || cv.version < 1) {
    return {
      ...cv,
      version: 1,
      sectionOrder: cv.sectionOrder || ["experience", "education", "skills", "projects", "certifications"],
      hiddenSections: cv.hiddenSections || [],
      projects: cv.projects || [],
      certifications: cv.certifications || [],
    } as CV;
  }

  return cv as CV;
};
