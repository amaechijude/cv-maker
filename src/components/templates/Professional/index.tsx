import { CV } from "@/types/cv";
import { cn } from "@/lib/utils";

export const ProfessionalTemplate = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    (section) => !data.hiddenSections.includes(section)
  );

  return (
    <div className="p-10 font-sans text-gray-900 bg-white min-h-[297mm]">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900">
            {data.personalInfo.fullName}
          </h1>
          <div className="mt-2 text-gray-600 font-medium">
            {[
              data.personalInfo.email,
              data.personalInfo.phone,
              data.personalInfo.location,
              data.personalInfo.website,
              data.personalInfo.linkedin,
            ]
              .filter(Boolean)
              .join(" • ")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10">
        {/* Main Column */}
        <div className="col-span-2 space-y-8">
          {/* Summary */}
          {data.personalInfo.summary && (
            <section>
              <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-gray-800">
                Professional Summary
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {data.personalInfo.summary}
              </p>
            </section>
          )}

          {visibleSections.map((section) => {
            if (section === "experience" && data.experience.length > 0) {
              return (
                <section key="experience">
                  <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1 text-gray-800">
                    Professional Experience
                  </h2>
                  <div className="space-y-6">
                    {data.experience
                      .sort((a, b) => a.order - b.order)
                      .map((job) => (
                        <div key={job.id}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-900">
                              {job.role}
                            </h3>
                            <span className="text-sm font-medium text-gray-600">
                              {job.dateRange}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mb-2 font-medium text-blue-700">
                            <span>{job.company}</span>
                            <span className="text-gray-500 italic">
                              {job.location}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {job.description}
                          </p>
                        </div>
                      ))}
                  </div>
                </section>
              );
            }

            if (section === "projects" && data.projects?.length > 0) {
                return (
                  <section key="projects">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1 text-gray-800">
                      Key Projects
                    </h2>
                    <div className="space-y-4">
                      {data.projects
                        .sort((a, b) => a.order - b.order)
                        .map((project) => (
                          <div key={project.id}>
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-md text-gray-900">
                                {project.name}
                              </h3>
                              <span className="text-xs font-medium text-gray-600">
                                {project.dateRange}
                              </span>
                            </div>
                            {project.link && (
                                <a href={project.link} className="text-xs text-blue-600 block mb-1">
                                    {project.link}
                                </a>
                            )}
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {project.description}
                            </p>
                          </div>
                        ))}
                    </div>
                  </section>
                );
              }

            return null;
          })}
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-8">
          {visibleSections.map((section) => {
             if (section === "skills" && data.skills.length > 0) {
                return (
                  <section key="skills">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1 text-gray-800">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                );
              }

            if (section === "education" && data.education.length > 0) {
              return (
                <section key="education">
                  <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1 text-gray-800">
                    Education
                  </h2>
                  <div className="space-y-4">
                    {data.education
                      .sort((a, b) => a.order - b.order)
                      .map((edu) => (
                        <div key={edu.id}>
                          <h3 className="font-bold text-sm text-gray-900">
                            {edu.degree}
                          </h3>
                          <div className="text-xs text-gray-700">
                            {edu.institution}
                          </div>
                          <div className="text-xs text-gray-500 italic mt-1">
                            {edu.dateRange}
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              );
            }

            if (section === "certifications" && data.certifications?.length > 0) {
                return (
                  <section key="certifications">
                    <h2 className="text-xl font-bold uppercase border-b border-gray-300 mb-4 pb-1 text-gray-800">
                      Certifications
                    </h2>
                    <div className="space-y-4">
                      {data.certifications
                        .sort((a, b) => a.order - b.order)
                        .map((cert) => (
                          <div key={cert.id}>
                            <h3 className="font-bold text-sm text-gray-900">
                              {cert.name}
                            </h3>
                            <div className="text-xs text-gray-700">
                              {cert.issuer}
                            </div>
                            <div className="text-xs text-gray-500 italic mt-1">
                              {cert.date}
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                );
              }
            
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
