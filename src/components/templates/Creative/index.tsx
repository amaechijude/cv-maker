import { CV } from "@/types/cv";

export const CreativeTemplate = ({ data }: { data: CV }) => {
  const visibleSections = data.sectionOrder.filter(
    (section) => !data.hiddenSections.includes(section)
  );

  return (
    <div className="font-sans text-gray-900 bg-white min-h-[297mm] flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-10 flex flex-col space-y-10">
        <div>
          <h1 className="text-3xl font-black uppercase leading-tight mb-4">
            {data.personalInfo.fullName.split(' ').map((name, i) => (
              <span key={i} className={i === 0 ? "block text-blue-400" : "block"}>
                {name}
              </span>
            ))}
          </h1>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Contact</span>
               <span>{data.personalInfo.email}</span>
               <span>{data.personalInfo.phone}</span>
               <span>{data.personalInfo.location}</span>
            </div>
            {(data.personalInfo.website || data.personalInfo.linkedin) && (
                 <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Online</span>
                    {data.personalInfo.website && <span className="truncate">{data.personalInfo.website}</span>}
                    {data.personalInfo.linkedin && <span className="truncate">{data.personalInfo.linkedin}</span>}
                 </div>
            )}
          </div>
        </div>

        {visibleSections.map((section) => {
            if (section === "skills" && data.skills.length > 0) {
                return (
                  <section key="skills" className="space-y-4">
                    <h2 className="text-xs uppercase font-black tracking-[0.2em] text-blue-400 border-b border-gray-700 pb-2">
                      Expertise
                    </h2>
                    <div className="flex flex-col gap-2">
                      {data.skills.map((skill) => (
                        <span key={skill} className="text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                );
              }

              if (section === "certifications" && data.certifications?.length > 0) {
                return (
                  <section key="certifications" className="space-y-4">
                    <h2 className="text-xs uppercase font-black tracking-[0.2em] text-blue-400 border-b border-gray-700 pb-2">
                      Awards
                    </h2>
                    <div className="space-y-4">
                      {data.certifications
                        .sort((a, b) => a.order - b.order)
                        .map((cert) => (
                          <div key={cert.id}>
                            <h3 className="font-bold text-sm">
                              {cert.name}
                            </h3>
                            <div className="text-xs text-gray-400">
                              {cert.issuer}
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

      {/* Main Content */}
      <div className="w-2/3 p-12 space-y-12">
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 mb-6">
              About Me
            </h2>
            <p className="text-lg font-medium text-gray-800 leading-relaxed italic border-l-4 border-blue-500 pl-6">
              "{data.personalInfo.summary}"
            </p>
          </section>
        )}

        {visibleSections.map((section) => {
          if (section === "experience" && data.experience.length > 0) {
            return (
              <section key="experience">
                <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 mb-8">
                  Experience
                </h2>
                <div className="space-y-10">
                  {data.experience
                    .sort((a, b) => a.order - b.order)
                    .map((job) => (
                      <div key={job.id} className="relative pl-8 before:absolute before:left-0 before:top-2 before:w-1 before:h-full before:bg-gray-100">
                        <div className="absolute left-[-4px] top-1.5 w-3 h-3 rounded-full bg-blue-500"></div>
                        <div className="flex justify-between items-baseline mb-2">
                          <h3 className="font-black text-xl text-gray-900">
                            {job.role}
                          </h3>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {job.dateRange}
                          </span>
                        </div>
                        <div className="font-bold text-gray-600 mb-4 uppercase tracking-wider text-xs">
                          {job.company} / {job.location}
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

          if (section === "education" && data.education.length > 0) {
            return (
              <section key="education">
                <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 mb-6">
                  Education
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {data.education
                    .sort((a, b) => a.order - b.order)
                    .map((edu) => (
                      <div key={edu.id} className="bg-gray-50 p-4 rounded-xl border-b-4 border-blue-500">
                        <h3 className="font-black text-sm text-gray-900 mb-1">
                          {edu.degree}
                        </h3>
                        <div className="text-xs text-gray-600 font-bold mb-1">
                          {edu.institution}
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold">
                          {edu.dateRange}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            );
          }

          if (section === "projects" && data.projects?.length > 0) {
            return (
              <section key="projects">
                <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 mb-6">
                  Featured Projects
                </h2>
                <div className="space-y-6">
                  {data.projects
                    .sort((a, b) => a.order - b.order)
                    .map((project) => (
                      <div key={project.id} className="group">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-black text-md text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.name}
                            </h3>
                            <span className="text-[10px] font-bold text-gray-400">{project.dateRange}</span>
                        </div>
                        {project.link && (
                            <div className="text-[10px] font-mono text-blue-500 mb-2 truncate">
                                {project.link}
                            </div>
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
    </div>
  );
};
