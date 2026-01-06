// components/templates/Minimal/index.tsx
import { CV } from '@/types/cv';

export const MinimalTemplate = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <div className="printable-preview p-10 font-sans bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">{data.personalInfo.fullName}</h1>
        <p className="text-xs text-gray-600 mb-4">
          {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location, data.personalInfo.website, data.personalInfo.linkedin].filter(Boolean).join(' • ')}
        </p>
        {data.personalInfo.summary && <p className="text-sm leading-relaxed text-gray-700">{data.personalInfo.summary}</p>}
      </div>

      {visibleSections.map((section) => {
        if (section === 'experience' && data.experience.length > 0) {
          return (
            <div key="experience" className="mb-6">
              <h2 className="text-sm font-bold uppercase mb-3">Experience</h2>
              {data.experience.sort((a, b) => a.order - b.order).map((job) => (
                <div key={job.id} className="mb-4">
                  <h3 className="text-sm font-semibold">{job.company} — {job.role}</h3>
                  <p className="text-xs text-gray-600 mb-1">{job.dateRange} • {job.location}</p>
                  <p className="text-sm leading-relaxed">{job.description}</p>
                </div>
              ))}
            </div>
          );
        }
        if (section === 'education' && data.education.length > 0) {
          return (
            <div key="education" className="mb-6">
              <h2 className="text-sm font-bold uppercase mb-3">Education</h2>
              {data.education.sort((a, b) => a.order - b.order).map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold">{edu.institution}</h3>
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
              <h2 className="text-sm font-bold uppercase mb-3">Skills</h2>
              <p className="text-sm">{data.skills.join(' • ')}</p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
