
import React from 'react';
import { GenerationResult } from '../types';

interface Props {
  result: GenerationResult;
  onBack: () => void;
}

export const ResultSection: React.FC<Props> = ({ result, onBack }) => {
  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `TodaysCanvas-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-6">
        <div className="relative group overflow-hidden bg-current bg-opacity-5 rounded-sm border-4 border-white dark:border-gray-800 shadow-2xl">
           <img 
             src={result.imageUrl} 
             alt="今日のキャンバス" 
             className="w-full h-auto object-cover transition-transform duration-[4s] group-hover:scale-105"
           />
           <div className="absolute inset-0 border border-current border-opacity-5 pointer-events-none"></div>
        </div>
        <div className="text-center opacity-40 italic font-light text-sm tracking-wide py-4 px-12 serif leading-relaxed border-t border-current border-opacity-10 mt-8">
          「{result.originalText}」
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center space-x-4 py-5 border border-current border-opacity-20 hover:border-opacity-100 hover:bg-current hover:text-white dark:hover:text-black transition-all group"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase serif italic">作品を保存する</span>
        </button>
        <button
          onClick={onBack}
          className="flex items-center justify-center space-x-4 py-5 opacity-40 hover:opacity-100 transition-all border border-transparent"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase serif italic">別の物語を描く</span>
        </button>
      </div>
    </div>
  );
};
