
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-sm transform rotate-45"></div>
          <span className="text-xl font-bold tracking-tighter uppercase">One Day Labo</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
          <a href="#projects" className="hover:text-white transition-colors">プロジェクト</a>
          <a href="#" className="hover:text-white transition-colors">私たちについて</a>
          <a href="#" className="hover:text-white transition-colors">ビジョン</a>
          <a href="#" className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-all font-bold">お問い合わせ</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
