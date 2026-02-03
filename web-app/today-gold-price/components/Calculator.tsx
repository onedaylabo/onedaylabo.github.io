
import React, { useState, useEffect } from 'react';

interface CalculatorProps {
  currentPrice: number;
}

const Calculator: React.FC<CalculatorProps> = ({ currentPrice }) => {
  const [grams, setGrams] = useState<string>('1');
  const [total, setTotal] = useState<number>(currentPrice);

  useEffect(() => {
    const g = parseFloat(grams);
    if (!isNaN(g)) {
      setTotal(g * currentPrice);
    } else {
      setTotal(0);
    }
  }, [grams, currentPrice]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h.01a1 1 0 100-2H10zm3 0a1 1 0 100 2h.01a1 1 0 100-2H13zm-3-4a1 1 0 100 2h.01a1 1 0 100-2H10zm3 0a1 1 0 100 2h.01a1 1 0 100-2H13zM7 8a1 1 0 100 2h.01a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        </span>
        換算シミュレーター
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">重量 (グラム)</label>
          <div className="relative">
            <input
              type="number"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              placeholder="0.0"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
              g
            </div>
          </div>
        </div>
        <div className="pt-2">
          <div className="text-sm font-medium text-slate-500 mb-1">推定価格 (税込)</div>
          <div className="text-3xl font-bold text-slate-900">
            ¥{Math.round(total).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
