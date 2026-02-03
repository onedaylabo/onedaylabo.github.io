
import React, { useState, useEffect, useCallback } from 'react';
import { fetchGoldPriceData } from './services/geminiService';
import { GoldData, AppState } from './types';
import PriceChart from './components/PriceChart';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    data: null,
    loading: true,
    error: null,
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const goldData = await fetchGoldPriceData();
      setState({ data: goldData, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">最新の金価格を検索中...</p>
        </div>
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">データの取得に失敗しました</h2>
          <p className="text-slate-500 mb-6">{state.error || '予期せぬエラーが発生しました。'}</p>
          <button 
            onClick={loadData}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            再試行する
          </button>
        </div>
      </div>
    );
  }

  const { data } = state;

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-200">
              G
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Today's Gold Price</h1>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            更新日: {data.lastUpdated}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Price Card */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-3xl p-8 text-white shadow-xl shadow-amber-200/50">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="text-amber-100 font-medium mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    本日の金小売価格
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-extrabold tracking-tighter">
                      ¥{data.price.toLocaleString()}
                    </span>
                    <span className="text-xl font-medium text-amber-100">/ 1g (税込)</span>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                   <div className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                     + ¥{(data.price - data.trend[0].value).toLocaleString()} <span className="text-xs opacity-75">vs 4日前</span>
                   </div>
                </div>
              </div>
            </section>

            {/* Price Chart */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-6 text-slate-800">価格推移 (直近5日間)</h3>
              <PriceChart data={data.trend} />
            </section>

            {/* Analysis Summary */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 text-slate-800">市場概況</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.summary}
              </div>
            </section>

            {/* Sources */}
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">情報ソース</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.sources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-amber-300 transition-all group"
                  >
                    <div className="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-600 truncate">{source.title}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Calculator currentPrice={data.price} />
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                豆知識
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                「金」はインフレに強い実物資産として知られています。地政学的なリスクが高まると「有事の金」として買われる傾向があります。
              </p>
            </div>

            <button 
              onClick={loadData}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 font-bold py-4 px-6 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              情報を更新する
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-slate-400 text-xs px-4">
        <p>© 2024 Today's Gold Price Japan - Powered by Gemini AI</p>
        <p className="mt-1">※本情報は参考値であり、実際の取引価格は各貴金属取扱店にてご確認ください。</p>
      </footer>
    </div>
  );
};

export default App;
