
import React from 'react';

interface Props {
  children: React.ReactNode;
  isDark: boolean;
  toggleDark: () => void;
}

export const Layout: React.FC<Props> = ({ children, isDark, toggleDark }) => {
  return (
    <div className={`min-h-screen flex flex-col items-center px-4 py-8 md:py-16 transition-colors duration-700 ${isDark ? 'bg-[#121212] text-[#e0e0e0]' : 'bg-[#fcfcf9] text-[#1a1a1a]'}`}>
      <header className="mb-12 text-center w-full max-w-4xl flex justify-between items-center border-b pb-6 border-current opacity-80">
        <div className="flex-1 hidden sm:block"></div>
        <div className="flex-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-1 serif whitespace-nowrap">今日のキャンバス</h1>
          <p className="text-[10px] opacity-60 font-medium tracking-[0.3em] uppercase whitespace-nowrap">あなたの一日の物語、4枚の記憶</p>
        </div>
        <div className="flex-1 flex justify-end">
          <button 
            onClick={toggleDark}
            className="p-2 rounded-full border border-current opacity-40 hover:opacity-100 transition-opacity"
            aria-label="テーマ切り替え"
          >
            {isDark ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            )}
          </button>
        </div>
      </header>
      <main className="w-full max-w-2xl">
        {children}
      </main>
      <footer className="mt-auto pt-16 pb-8 text-center text-[10px] opacity-30 font-light uppercase tracking-widest">
        記憶の展示室 &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};
