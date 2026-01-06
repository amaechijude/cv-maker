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
