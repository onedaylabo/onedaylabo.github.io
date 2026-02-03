/**
 * Word Loop - English Vocabulary Learning App
 * Logic & State Management
 */

class WordLoop {
    constructor() {
        this.words = [];
        this.history = JSON.parse(localStorage.getItem('word_loop_history') || '{}');

        // デフォルト設定
        const defaultSettings = {
            mode: 'en-jp',
            darkMode: false,
            reviewMode: false,
            audioMode: true
        };

        try {
            const saved = localStorage.getItem('word_loop_settings');
            let settings = saved ? JSON.parse(saved) : defaultSettings;

            // マイグレーション & バリデーション
            if (!settings || typeof settings !== 'object') {
                settings = defaultSettings;
            }

            // 必要なプロパティが欠けている場合の補完
            this.settings = { ...defaultSettings, ...settings };

            // 互換性維持のため現在の設定を保存
            this.saveSettings();
        } catch (e) {
            console.error('Settings load error:', e);
            this.settings = defaultSettings;
        }

        this.currentWord = null;
        this.state = 'question'; // 'question' or 'answer'

        // DOM elements
        this.questionEl = document.getElementById('question-text');
        this.answerEl = document.getElementById('answer-text');
        this.answerSection = document.getElementById('answer-section');
        this.revealBtn = document.getElementById('reveal-btn');
        this.judgmentBtns = document.getElementById('judgment-btns');
        this.modeEnJpBtn = document.getElementById('mode-en-jp');
        this.modeJpEnBtn = document.getElementById('mode-jp-en');
        this.reviewToggleBtn = document.getElementById('review-toggle');
        this.reviewBadge = document.getElementById('review-badge');
        this.listToggleBtn = document.getElementById('list-toggle');
        this.listModal = document.getElementById('list-modal');
        this.closeListBtn = document.getElementById('close-list');
        this.wordListContainer = document.getElementById('word-list-container');
        this.listSearchInput = document.getElementById('list-search');

        this.init();
    }

    async init() {
        // データの読み込み
        await this.loadData();
        this.setupEventListeners();
        this.applySettings();
    }

    async loadData() {
        try {
            console.log('Attempting to load window.WORD_DATA...');

            // index.htmlで読み込まれた words_data.js のデータを使用
            if (window.WORD_DATA && Array.isArray(window.WORD_DATA) && window.WORD_DATA.length > 0) {
                this.words = window.WORD_DATA;
                console.log('Successfully loaded ' + this.words.length + ' words direttamente from WORD_DATA variable.');
            } else {
                throw new Error('単語データが window.WORD_DATA に見つかりませんでした。words_data.js が正しく読み込まれているか確認してください。');
            }

            // 最初の単語を表示
            this.nextWord();
        } catch (error) {
            console.error('Data load error:', error);
            this.showLoadError(error.message);
        }
    }

    showLoadError(message) {
        this.questionEl.style.fontSize = '1.1rem';
        this.questionEl.innerHTML = `
            <div style="color: #e74c3c; margin-bottom: 10px;">データの読み込みに失敗しました</div>
            <div style="font-size: 0.85rem; color: #666;">
                要因: ${message}<br><br>
                <div style="background: #f0f0f5; padding: 10px; border-radius: 8px; text-align: left;">
                    <strong>解決策:</strong><br>
                    1. サーバー(Live Server等)で実行してください<br>
                    2. words_data.js が存在することを確認してください
                </div>
            </div>
        `;
    }

    // 履歴データの初期化（単語ごとに記録）
    getWordStats(wordId) {
        if (!this.history[wordId]) {
            this.history[wordId] = {
                attempts: 0,
                mistakes: 0,
                streak: 0,
                lastSeen: 0
            };
        }
        return this.history[wordId];
    }

    saveHistory() {
        localStorage.setItem('word_loop_history', JSON.stringify(this.history));
    }

    saveSettings() {
        localStorage.setItem('word_loop_settings', JSON.stringify(this.settings));
    }

    applySettings() {
        // ダークモードの反映
        if (this.settings.darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.getElementById('dark-mode-toggle').checked = true;
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.getElementById('dark-mode-toggle').checked = false;
        }

        // 音声モードの反映
        document.getElementById('audio-mode-toggle').checked = this.settings.audioMode;

        // モードボタンの反映
        if (this.settings.mode === 'en-jp') {
            this.modeEnJpBtn.classList.add('active');
            this.modeJpEnBtn.classList.remove('active');
        } else {
            this.modeJpEnBtn.classList.add('active');
            this.modeEnJpBtn.classList.remove('active');
        }

        // 復習モードの反映
        if (this.settings.reviewMode) {
            this.reviewToggleBtn.classList.add('active');
        } else {
            this.reviewToggleBtn.classList.remove('active');
        }
        this.updateReviewBadge();
    }

    updateReviewBadge() {
        const reviewCount = this.words.filter(w => {
            const stats = this.history[w.id];
            return stats && stats.mistakes > 0;
        }).length;

        if (reviewCount > 0) {
            this.reviewBadge.textContent = reviewCount;
            this.reviewBadge.classList.remove('hidden');
        } else {
            this.reviewBadge.classList.add('hidden');
        }
    }

    setupEventListeners() {
        // 復習モードトグル
        this.reviewToggleBtn.addEventListener('click', () => {
            this.settings.reviewMode = !this.settings.reviewMode;
            this.saveSettings();
            this.applySettings();
            this.nextWord();
        });

        // ダークモード切替
        document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
            this.settings.darkMode = e.target.checked;
            this.saveSettings();
            this.applySettings();
        });

        // 音声モード切替
        document.getElementById('audio-mode-toggle').addEventListener('change', (e) => {
            this.settings.audioMode = e.target.checked;
            this.saveSettings();
        });

        // モード切替
        this.modeEnJpBtn.addEventListener('click', () => this.setMode('en-jp'));
        this.modeJpEnBtn.addEventListener('click', () => this.setMode('jp-en'));

        // 答えを見る
        this.revealBtn.addEventListener('click', () => this.revealAnswer());

        // 正解・不正解
        document.getElementById('correct-btn').addEventListener('click', () => this.handleJudgment(true));
        document.getElementById('incorrect-btn').addEventListener('click', () => this.handleJudgment(false));

        // 設定モーダル
        const modal = document.getElementById('settings-modal');
        document.getElementById('settings-toggle').addEventListener('click', () => modal.classList.remove('hidden'));
        document.getElementById('close-settings').addEventListener('click', () => modal.classList.add('hidden'));

        // 単語一覧モーダル
        this.listToggleBtn.addEventListener('click', () => {
            this.renderWordList();
            this.listModal.classList.remove('hidden');
        });
        this.closeListBtn.addEventListener('click', () => this.listModal.classList.add('hidden'));

        // 単語一覧検索
        this.listSearchInput.addEventListener('input', () => this.renderWordList());

        // リセット
        document.getElementById('reset-data').addEventListener('click', () => {
            if (confirm('すべての学習データをリセットしますか？')) {
                this.history = {};
                this.saveHistory();
                alert('リセットされました。');
                location.reload();
            }
        });
    }

    renderWordList() {
        const query = this.listSearchInput.value.toLowerCase();
        const filtered = this.words.filter(w =>
            w.english.toLowerCase().includes(query) ||
            w.japanese.includes(query)
        );

        this.wordListContainer.innerHTML = filtered.map(word => {
            const stats = this.history[word.id] || {};
            const isNeedReview = stats.mistakes > 0;
            return `
                <div class="word-item">
                    <div class="word-info">
                        <span class="en">${word.english}</span>
                        <span class="jp">${word.japanese}</span>
                    </div>
                    ${isNeedReview ? '<span class="stats need-review">要復習</span>' : ''}
                </div>
            `;
        }).join('');
    }

    setMode(mode) {
        this.settings.mode = mode;
        this.saveSettings();
        this.applySettings();
        this.nextWord();
    }

    // 重み付きランダム選択
    pickWeightedWord() {
        let filteredWords = this.words;

        // 復習モード: 不正解が1回でもある単語のみ
        if (this.settings.reviewMode) {
            filteredWords = filteredWords.filter(w => {
                const stats = this.history[w.id];
                return stats && stats.mistakes > 0;
            });
        }

        if (filteredWords.length === 0) return null;

        let totalWeight = 0;
        const weightedWords = filteredWords.map(word => {
            const stats = this.getWordStats(word.id);
            // 重みの計算: 間違えるほど高く、連続正解するほど低く
            const weight = (stats.mistakes + 1) / (stats.streak + 1);
            totalWeight += weight;
            return { word, weight };
        });

        let random = Math.random() * totalWeight;
        for (const item of weightedWords) {
            random -= item.weight;
            if (random <= 0) return item.word;
        }
        return weightedWords[0].word;
    }

    nextWord() {
        const word = this.pickWeightedWord();
        if (!word) {
            if (this.words.length === 0) {
                this.questionEl.textContent = '単語データが読み込まれていません';
            } else {
                this.questionEl.textContent = '復習が必要な単語がありません';
            }
            this.revealBtn.disabled = true;
            return;
        }

        this.currentWord = word;
        this.state = 'question';
        this.revealBtn.disabled = false;

        // UIリセット
        this.answerSection.classList.add('hidden');
        this.judgmentBtns.classList.add('hidden');
        this.revealBtn.classList.remove('hidden');

        if (this.settings.mode === 'en-jp') {
            this.questionEl.textContent = word.english;
            this.answerEl.textContent = word.japanese;
        } else {
            this.questionEl.textContent = word.japanese;
            this.answerEl.textContent = word.english;
        }
    }

    revealAnswer() {
        this.state = 'answer';
        this.answerSection.classList.remove('hidden');
        this.revealBtn.classList.add('hidden');
        this.judgmentBtns.classList.remove('hidden');

        // 音声再生
        if (this.settings.audioMode) {
            this.speak(this.currentWord.english);
        }
    }

    speak(text) {
        if (!window.speechSynthesis) return;

        // 全てのブラウザ（特にEdge）の読み上げキューを完全にリセット
        window.speechSynthesis.cancel();

        const executeSpeak = () => {
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();

            utterance.lang = 'en-US';

            if (voices.length > 0) {
                // Microsoft Edge の高品質音声 (Natural) または Google US English を優先的に探索
                const preferredVoice = voices.find(v =>
                    (v.name.includes('Microsoft') && v.name.includes('English') && v.name.includes('Natural')) ||
                    (v.name.includes('Google') && v.name.includes('US English')) ||
                    (v.lang === 'en-US' && v.name.includes('Aria')) ||
                    (v.lang === 'en-US')
                );
                if (preferredVoice) utterance.voice = preferredVoice;
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // 他の読み上げが一時停止していたら再開（Edge対策）
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }

            window.speechSynthesis.speak(utterance);
        };

        // cancel() の実行完了を少し待ってから開始 (Edge対策で少し長めの100ms)
        setTimeout(() => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length === 0) {
                // ボイスがロードされるのを待つ
                window.speechSynthesis.onvoiceschanged = () => {
                    executeSpeak();
                    window.speechSynthesis.onvoiceschanged = null;
                };
            } else {
                executeSpeak();
            }
        }, 100);
    }

    handleJudgment(isCorrect) {
        const stats = this.getWordStats(this.currentWord.id);
        stats.attempts++;
        stats.lastSeen = Date.now();

        if (isCorrect) {
            stats.streak++;
            // 復習完了: 正解した場合は不正解カウントをリセットして復習リストから除外
            if (this.settings.reviewMode) {
                stats.mistakes = 0;
            }
        } else {
            stats.mistakes++;
            stats.streak = 0;
        }

        this.saveHistory();
        this.updateReviewBadge();
        this.nextWord();
    }
}

// アプリ起動
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WordLoop();
});
