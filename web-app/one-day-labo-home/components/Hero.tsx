
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-[0.2em] uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
          Creative Software Studio
        </div>
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
          デジタルで<br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">新しい地平を拓く</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-12 font-light leading-relaxed">
          One Day Laboは、実験的なアイデアを洗練されたデジタル体験へと昇華させる研究所です。<br className="hidden md:block" />
          私たちは一日一日、未来を形作るツールを構築しています。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <a href="#projects" className="px-10 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
            制作実績を見る
          </a>
          <button className="px-10 py-4 glass-effect text-white rounded-full font-bold hover:bg-white/10 transition-colors border border-white/20">
            私たちのプロセス
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
