
import React, { useState, useRef } from 'react';
import { MOODS, STYLES } from '../constants';
import { MoodType, StyleType } from '../types';
import { VoiceTranscriber } from '../services/voiceService';

interface Props {
  text: string;
  // Fix: Changed type to allow functional updates which are supported by useState setter
  setText: React.Dispatch<React.SetStateAction<string>>;
  mood: MoodType;
  setMood: (v: MoodType) => void;
  style: StyleType;
  setStyle: (v: StyleType) => void;
  onGenerate: () => void;
  isDark: boolean;
}

export const InputSection: React.FC<Props> = ({
  text, setText, mood, setMood, style, setStyle, onGenerate, isDark
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const transcriberRef = useRef<VoiceTranscriber | null>(null);
  const isReady = text.trim().length >= 10;

  const toggleVoiceInput = async () => {
    if (isRecording) {
      if (transcriberRef.current) {
        await transcriberRef.current.stop();
        transcriberRef.current = null;
      }
      setIsRecording(false);
    } else {
      try {
        const transcriber = new VoiceTranscriber();
        await transcriber.start((newText) => {
          // Functional update is now correctly typed
          setText((prev) => prev + newText);
        });
        transcriberRef.current = transcriber;
        setIsRecording(true);
      } catch (err) {
        console.error("Microphone access failed", err);
        alert("マイクの使用が許可されていないか、エラーが発生しました。");
      }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50 font-semibold italic">今日の物語</label>
          <button 
            onClick={toggleVoiceInput}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full border border-current transition-all duration-300 ${isRecording ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'opacity-40 hover:opacity-100'}`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <span className="text-[9px] font-bold tracking-widest uppercase">{isRecording ? '録音中...' : '音声で入力'}</span>
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="今日はどのような一日でしたか？（声でも入力できます）"
          className={`w-full h-56 p-8 bg-transparent border-b border-current focus:border-opacity-100 border-opacity-20 outline-none transition-all resize-none text-xl leading-relaxed serif placeholder-current placeholder-opacity-20`}
        />
        <div className="flex justify-between items-center mt-2 opacity-30 text-[9px] tracking-widest uppercase">
          <span>最低10文字以上</span>
          <span>{text.length} / 500 文字</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50 font-semibold italic">心境・雰囲気</label>
          <div className="flex space-x-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex-1 py-4 rounded-none border transition-all text-lg ${
                  mood === m.value 
                  ? 'border-current bg-current text-white dark:text-black scale-105 z-10' 
                  : 'border-current border-opacity-10 hover:border-opacity-50'
                }`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] uppercase tracking-[0.2em] opacity-50 font-semibold italic">絵のスタイル</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as StyleType)}
            className="w-full p-4 bg-transparent border border-current border-opacity-10 focus:border-opacity-100 outline-none appearance-none cursor-pointer text-sm font-medium tracking-wide uppercase"
          >
            {STYLES.map((s) => (
              <option key={s.value} value={s.value} className={isDark ? 'bg-[#121212] text-white' : 'bg-white text-black'}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={onGenerate}
          disabled={!isReady}
          className={`group relative w-full py-6 transition-all duration-500 overflow-hidden border border-current ${
            isReady 
            ? 'opacity-100 hover:bg-current hover:text-white dark:hover:text-black' 
            : 'opacity-20 cursor-not-allowed'
          }`}
        >
          <span className="relative z-10 text-sm font-bold tracking-[0.4em] uppercase serif italic">
            4コマの作品を描く
          </span>
        </button>
      </div>
    </div>
  );
};
