
import React from 'react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-effect rounded-3xl animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          <div className="h-64 md:h-full overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-14">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">
                {project.category}
              </span>
              <span className="text-xs text-gray-500">{project.date}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">{project.title}</h2>
            
            <div className="space-y-8 text-gray-300 font-light leading-relaxed">
              <div className="prose prose-invert">
                <p className="text-lg">{project.longDescription}</p>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center">
                  <span className="w-8 h-px bg-indigo-500 mr-3"></span>
                  使用技術 / Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-10">
                <a 
                  href={project.url}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                >
                  <span>アプリケーションを起動</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
