
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import GeminiAssistant from './components/GeminiAssistant';
import { PROJECTS } from './constants';
import { Project } from './types';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen hero-gradient overflow-x-hidden">
      <Navbar />
      
      <main>
        <Hero />
        
        <section className="max-w-7xl mx-auto px-6 py-32" id="projects">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 space-y-6 md:space-y-0">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Portfolio</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </div>
            <p className="max-w-md text-gray-400 font-light text-lg leading-relaxed">
              過去1年間に開発した、実験的なプロジェクトから実用的なアプリケーションまで、厳選されたポートフォリオです。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROJECTS.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={(p) => setSelectedProject(p)} 
              />
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-48 border-t border-white/5">
          <div className="glass-effect rounded-[3rem] p-10 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/5 to-transparent -z-10"></div>
            <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-[1.1]">
              あなたの<span className="text-indigo-400">「想い」</span>を、<br />形にしませんか？
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 mb-14 text-xl font-light">
              私たちは先見性のあるパートナーと共に、複雑な課題を優雅なデジタルソリューションへと変換します。あなたの次の挑戦をサポートさせてください。
            </p>
            <button className="px-14 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-white/10">
              プロジェクトを相談する
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-10 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-sm transform rotate-45 shadow-lg shadow-indigo-500/50"></div>
              <span className="text-2xl font-black tracking-tighter text-white">ONE DAY LABO</span>
            </div>
            <p className="text-gray-500 text-sm">日々の革新、優雅な構築。</p>
          </div>
          
          <div className="flex space-x-12 text-gray-400 font-medium">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
          
          <div className="text-right text-gray-500 text-sm">
            <p>© 2024 One Day Labo. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
      
      <GeminiAssistant />
    </div>
  );
};

export default App;
