// components/templates/Classic/index.tsx
import { CV } from '@/types/cv';

export const ClassicTemplate = ({ data }: { data: CV }) => {
  // Filter visible sections
  const visibleSections = data.sectionOrder.filter(
    section => !data.hiddenSections.includes(section)
  );

  return (
    <div className="printable-preview p-10 font-serif bg-white text-black">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-black">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-sm text-black mb-4">
          {[
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.linkedin && `in/${data.personalInfo.linkedin.split('/').pop()}`,
            data.personalInfo.website,
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
              <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-4 text-black">
                Experience
              </h2>
              {data.experience
                .sort((a, b) => a.order - b.order)
                .map((job) => (
                  <div key={job.id} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1 text-black">
                      <h3 className="text-base font-bold">
                        {job.company}
                      </h3>
                      <span className="text-sm">
                         {job.dateRange}
                      </span>
                    </div>
                     <p className="text-sm italic mb-2 text-black">
                       {job.role} • {job.location}
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
              <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-4 text-black">
                Education
              </h2>
              {data.education
                .sort((a, b) => a.order - b.order)
                .map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <div className="flex justify-between items-baseline text-black">
                      <h3 className="text-base font-bold">{edu.institution}</h3>
                      <span className="text-sm text-black">{edu.dateRange}</span>
                    </div>
                    <p className="text-sm italic text-black">{edu.degree}</p>
                  </div>
                ))}
            </div>
          );
        }

        if (section === 'skills' && data.skills.length > 0) {
          return (
            <div key="skills">
              <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-4 text-black">
                Skills
              </h2>
              <div className="text-sm text-black">
                 <span className="font-bold">Skills: </span>
                 {data.skills.join(', ')}.
              </div>
            </div>
          );
        }

        if (section === 'projects' && data.projects && data.projects.length > 0) {
          return (
            <div key="projects" className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-4 text-black">
                Projects
              </h2>
              {data.projects
                .sort((a, b) => a.order - b.order)
                .map((project) => (
                  <div key={project.id} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1 text-black">
                      <h3 className="text-base font-bold">
                        {project.name}
                      </h3>
                      <span className="text-sm">
                         {project.dateRange}
                      </span>
                    </div>
                    {project.link && (
                       <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 block mb-1 hover:underline">
                         {project.link}
                       </a>
                    )}
                    <p className="text-sm leading-relaxed">{project.description}</p>
                  </div>
                ))}
            </div>
          );
        }

        if (section === 'certifications' && data.certifications && data.certifications.length > 0) {
          return (
            <div key="certifications" className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b-2 border-black mb-4 text-black">
                Certifications
              </h2>
              {data.certifications
                .sort((a, b) => a.order - b.order)
                .map((cert) => (
                  <div key={cert.id} className="mb-3">
                    <div className="flex justify-between items-baseline text-black">
                      <h3 className="text-base font-bold">{cert.name}</h3>
                      <span className="text-sm text-black">{cert.date}</span>
                    </div>
                    <p className="text-sm italic text-black">{cert.issuer}</p>
                     {cert.link && (
                       <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 block hover:underline">
                         {cert.link}
                       </a>
                    )}
                  </div>
                ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
