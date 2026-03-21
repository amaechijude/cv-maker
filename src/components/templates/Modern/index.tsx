// components/templates/Modern/index.tsx
import { CV } from '@/types/cv';
import { cn } from '@/lib/utils';

export const ModernTemplate = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <div className="printable-preview p-16 font-sans bg-white text-[#181c1e] min-h-[297mm]">
      {/* Editorial Header */}
      <header className="mb-12 border-b-2 border-[#002045] pb-8">
        <h1 className="text-5xl font-serif font-medium text-[#002045] mb-4 tracking-tight">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.2em] font-bold text-[#43474e]">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.website && <span className="lowercase tracking-normal font-medium text-[#002045] underline decoration-1 underline-offset-2">{data.personalInfo.website}</span>}
          {data.personalInfo.linkedin && <span className="lowercase tracking-normal font-medium text-[#002045] underline decoration-1 underline-offset-2">{data.personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Profile / Summary */}
      {data.personalInfo.summary && (
        <section className="mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#002045]/30 mb-4">Professional Profile</h2>
          <p className="text-sm leading-relaxed font-light text-[#181c1e]">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {visibleSections.map((section) => {
        if (section === 'experience' && data.experience.length > 0) {
          return (
            <section key="experience" className="mb-12">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#002045]/30 mb-6">Professional Experience</h2>
              <div className="space-y-8">
                {data.experience.sort((a, b) => (a.order || 0) - (b.order || 0)).map((job) => (
                  <div key={job.id} className="relative pl-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-lg font-serif font-bold text-[#002045]">
                        {job.company}
                      </h3>
                      <span className="text-[10px] font-bold text-[#43474e] uppercase tracking-wider">
                        {job.startDate} — {job.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#43474e] uppercase tracking-widest mb-3">
                      {job.role} <span className="mx-2 opacity-20">|</span> {job.location}
                    </p>
                    <p className="text-sm leading-relaxed text-[#181c1e] whitespace-pre-wrap">{job.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'education' && data.education.length > 0) {
          return (
            <section key="education" className="mb-12">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#002045]/30 mb-6">Academic History</h2>
              <div className="space-y-6">
                {data.education.sort((a, b) => (a.order || 0) - (b.order || 0)).map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-serif font-bold text-[#002045]">{edu.institution}</h3>
                      <span className="text-[10px] font-bold text-[#43474e] uppercase tracking-wider">{edu.startDate} — {edu.endDate}</span>
                    </div>
                    <p className="text-xs font-medium text-[#43474e] italic">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'skills' && data.skills.length > 0) {
          return (
            <section key="skills" className="mb-12">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#002045]/30 mb-4">Competencies</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-[#f1f4f6] text-[#002045] px-3 py-1 rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          );
        }

        if (section === 'projects' && data.projects && data.projects.length > 0) {
          return (
            <section key="projects" className="mb-12">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#002045]/30 mb-6">Selected Works</h2>
              <div className="space-y-6">
                {data.projects.sort((a, b) => (a.order || 0) - (b.order || 0)).map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-base font-serif font-bold text-[#002045]">
                        {project.name}
                      </h3>
                      <span className="text-[10px] font-bold text-[#43474e] uppercase tracking-wider">
                        {project.startDate} — {project.endDate}
                      </span>
                    </div>
                    {project.link && (
                       <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#002045] underline decoration-1 underline-offset-2 mb-2 block font-bold">
                         {project.link.replace(/^https?:\/\//, '')}
                       </a>
                    )}
                    <p className="text-sm leading-relaxed text-[#181c1e]">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}

      {/* Footer Branding */}
      <footer className="mt-auto pt-16 border-t border-[#002045]/5 text-center">
        <span className="text-[8px] uppercase tracking-[0.5em] font-black text-[#002045]/20">
          Generated via Digital Curator Editorial Suite
        </span>
      </footer>
    </div>
  );
};
