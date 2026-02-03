
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

let currentPrice = 0;

async function fetchGoldData() {
    showLoading(true);
    
    const prompt = `
        Search for the current retail gold price per gram in Japanese Yen (JPY) in Japan for today.
        Provide a 2-3 sentence market trend summary in Japanese.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text || "情報を取得できませんでした。";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        // 価格抽出
        const priceMatch = text.match(/(\d{1,3}(,\d{3})*|\d+)\s*円/);
        currentPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 14000;

        // UI更新
        updateUI(currentPrice, text, groundingChunks);
    } catch (error) {
        console.error(error);
        alert("データの取得に失敗しました。");
    } finally {
        showLoading(false);
    }
}

function updateUI(price, summary, chunks) {
    document.getElementById('main-price').innerText = `¥${price.toLocaleString()}`;
    document.getElementById('market-summary').innerText = summary;
    document.getElementById('last-updated').innerText = `更新日: ${new Date().toLocaleDateString('ja-JP')}`;
    
    // 計算機の初期値更新
    updateCalculation();

    // ソースの表示
    const sourcesContainer = document.getElementById('sources-container');
    sourcesContainer.innerHTML = '';
    
    const sources = chunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
            title: chunk.web?.title || "参考資料",
            uri: chunk.web?.uri || "#"
        }));

    sources.forEach(source => {
        const anchor = document.createElement('a');
        anchor.href = source.uri;
        anchor.target = "_blank";
        anchor.className = "flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-amber-300 transition-all group";
        anchor.innerHTML = `
            <div class="w-8 h-8 rounded bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </div>
            <span class="text-sm font-medium text-slate-600 truncate">${source.title}</span>
        `;
        sourcesContainer.appendChild(anchor);
    });
}

function updateCalculation() {
    const input = document.getElementById('calc-input');
    const result = document.getElementById('calc-result');
    const grams = parseFloat(input.value) || 0;
    result.innerText = `¥${Math.round(grams * currentPrice).toLocaleString()}`;
}

function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// イベントリスナー
document.getElementById('calc-input').addEventListener('input', updateCalculation);
document.getElementById('refresh-btn').addEventListener('click', fetchGoldData);

// 初回起動
fetchGoldData();
