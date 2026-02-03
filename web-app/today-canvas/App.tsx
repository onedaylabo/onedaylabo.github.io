
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { InputSection } from './components/InputSection';
import { ProcessingSection } from './components/ProcessingSection';
import { ResultSection } from './components/ResultSection';
import { AppState, MoodType, StyleType, GenerationResult } from './types';
import { generateArtFromDay } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [text, setText] = useState('');
  const [mood, setMood] = useState<MoodType>('NORMAL');
  const [style, setStyle] = useState<StyleType>('CINEMATIC');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDark(true);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setAppState('PROCESSING');
    setErrorMessage(null);

    try {
      const { imageUrl, prompt } = await generateArtFromDay(text, mood, style);
      setResult({
        imageUrl,
        interpretedPrompt: prompt,
        originalText: text
      });
      setAppState('RESULT');
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "画像の生成中にエラーが発生しました。しばらく待ってからやり直してください。");
      setAppState('ERROR');
    }
  };

  const handleReset = () => {
    setAppState('IDLE');
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <Layout isDark={isDark} toggleDark={toggleDark}>
      {appState === 'IDLE' && (
        <InputSection
          text={text}
          setText={setText}
          mood={mood}
          setMood={setMood}
          style={style}
          setStyle={setStyle}
          onGenerate={handleGenerate}
          isDark={isDark}
        />
      )}

      {appState === 'PROCESSING' && (
        <ProcessingSection />
      )}

      {appState === 'RESULT' && result && (
        <ResultSection result={result} onBack={handleReset} />
      )}

      {appState === 'ERROR' && (
        <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-500 serif italic">
          <div className="text-6xl opacity-20">!</div>
          <h2 className="text-2xl font-bold tracking-widest uppercase">描けなかった記憶</h2>
          <p className="text-sm opacity-50 px-12 leading-loose max-w-md mx-auto">
            {errorMessage}
          </p>
          <button
            onClick={handleReset}
            className="mt-8 px-12 py-4 border border-current border-opacity-20 hover:border-opacity-100 transition-all text-[10px] tracking-[0.4em] uppercase font-bold"
          >
            トップに戻る
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
