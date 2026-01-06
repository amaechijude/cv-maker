// components/templates/Modern/index.tsx
import { CV } from '@/types/cv';

export const ModernTemplate = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <div className="printable-preview p-10 font-sans bg-white">
      {/* Header with accent */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg">
        <h1 className="text-3xl font-bold text-blue-900 mb-1">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-sm text-blue-700 mb-3">
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

      {visibleSections.map((section) => {
        if (section === 'experience' && data.experience.length > 0) {
          return (
            <div key="experience" className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-500 pl-3 mb-3">
                Experience
              </h2>
              {data.experience.sort((a, b) => a.order - b.order).map((job) => (
                <div key={job.id} className="mb-4 pl-3">
                  <h3 className="text-sm font-bold text-blue-800">
                    {job.company} — {job.role}
                  </h3>
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
              <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-500 pl-3 mb-3">
                Education
              </h2>
              {data.education.sort((a, b) => a.order - b.order).map((edu) => (
                <div key={edu.id} className="mb-3 pl-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-blue-800">{edu.institution}</h3>
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
              <h2 className="text-lg font-bold text-blue-900 border-l-4 border-blue-500 pl-3 mb-3">
                Skills
              </h2>
              <p className="text-sm pl-3">{data.skills.join(' • ')}</p>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
