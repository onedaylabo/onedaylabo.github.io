
import React from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={() => onClick(project)}
      className="group relative cursor-pointer glass-effect rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded">
            {project.category}
          </span>
          <span className="text-xs text-gray-500">{project.date}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{project.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 font-light mb-6">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.techStack.slice(0, 3).map(tech => (
            <span key={tech} className="text-[10px] text-gray-500 border border-white/10 px-2 py-1 rounded">
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] text-gray-500 px-2 py-1">+{project.techStack.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
