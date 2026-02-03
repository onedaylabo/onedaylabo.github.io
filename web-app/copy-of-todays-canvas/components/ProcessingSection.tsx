
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

export const ProcessingSection: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-16 animate-in fade-in duration-1000">
      <div className="relative w-1 px-20">
        <div className="h-[1px] w-48 bg-current opacity-5 animate-[pulse_2s_infinite] origin-center"></div>
      </div>
      <div className="text-center h-24 max-w-xs mx-auto">
        <p className="text-current font-light tracking-[0.2em] text-sm italic serif opacity-60 leading-relaxed transition-all duration-1000">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <p className="mt-8 text-[9px] uppercase tracking-[0.5em] opacity-20 animate-pulse">
          4つの視点を統合中...
        </p>
      </div>
    </div>
  );
};
