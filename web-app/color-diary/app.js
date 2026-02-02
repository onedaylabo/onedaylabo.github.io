document.addEventListener('DOMContentLoaded', () => {
    // --- 状態管理 ---
    const state = {
        logs: JSON.parse(localStorage.getItem('color_diary_logs')) || [],
        settings: JSON.parse(localStorage.getItem('color_diary_settings')) || {
            darkMode: true,
            showMoodText: true,
            enableMemo: true
        },
        currentDate: new Date(),
        selectedColor: null,
        selectedMood: null,
        currentView: 'home',
        editingDate: null // nullの場合は今日
    };

    // --- カラー定義 (12色) ---
    const colors = [
        { color: '#ff4757', mood: 'エネルギッシュ' },
        { color: '#ffa502', mood: 'ワクワク' },
        { color: '#eccc68', mood: '楽しい' },
        { color: '#2ed573', mood: '安心' },
        { color: '#badc58', mood: '清々しい' },
        { color: '#1e90ff', mood: '落ち着いている' },
        { color: '#70a1ff', mood: '集中' },
        { color: '#a29bfe', mood: 'モヤモヤ' },
        { color: '#be2edd', mood: 'インスピレーション' },
        { color: '#ff9ff3', mood: '幸せ' },
        { color: '#747d8c', mood: '疲れ' },
        { color: '#2f3542', mood: '無気力' }
    ];

    // --- DOM要素 ---
    const screens = {
        home: document.getElementById('screen-home'),
        calendar: document.getElementById('screen-calendar'),
        list: document.getElementById('screen-list'),
        settings: document.getElementById('screen-settings')
    };

    const navItems = document.querySelectorAll('.nav-item');
    const colorPickerContainer = document.getElementById('color-picker');
    const moodText = document.getElementById('selected-mood-text');
    const memoArea = document.getElementById('mood-memo');
    const memoSection = document.getElementById('memo-section');
    const saveBtn = document.getElementById('save-btn');
    const statusCard = document.getElementById('status-card');
    const editingDateBadge = document.getElementById('editing-date-badge');
    const homeTitle = document.getElementById('home-title');
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonthText = document.getElementById('calendar-month');
    const logList = document.getElementById('log-list');
    const pageTitle = document.getElementById('page-title');
    const dateDisplay = document.getElementById('current-date-display');

    // --- 初期化 ---
    function init() {
        applySettings();
        updateDateDisplay();
        setupNavigation();
        setupColorPicker();
        setupEventListeners();
        checkTodayRecording();
        renderCalendar();
        renderList();
        switchView(state.currentView); // 初期画面を確実に表示
    }

    // --- 設定の適用 ---
    function applySettings() {
        // ダークモード
        if (state.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        document.getElementById('setting-dark-mode').checked = state.settings.darkMode;

        // 色の意味表示
        document.getElementById('setting-show-mood').checked = state.settings.showMoodText;
        if (!state.settings.showMoodText) {
            moodText.classList.add('hidden');
        } else {
            moodText.classList.remove('hidden');
        }

        // メモ入力の有無
        document.getElementById('setting-enable-memo').checked = state.settings.enableMemo;
        if (!state.settings.enableMemo) {
            memoSection.classList.add('hidden');
        } else {
            memoSection.classList.remove('hidden');
        }
    }

    function saveSettings() {
        state.settings.darkMode = document.getElementById('setting-dark-mode').checked;
        state.settings.showMoodText = document.getElementById('setting-show-mood').checked;
        state.settings.enableMemo = document.getElementById('setting-enable-memo').checked;

        localStorage.setItem('color_diary_settings', JSON.stringify(state.settings));
        applySettings();
    }

    // --- ナビゲーション ---
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetView = item.dataset.screen;
                if (targetView === 'home') {
                    state.editingDate = null; // ナビゲーションから「今日」を押した時はリセット
                }
                switchView(targetView);
            });
        });
    }

    function switchView(viewName) {
        state.currentView = viewName;

        // UIの切り替え
        Object.keys(screens).forEach(key => {
            if (key === viewName) {
                screens[key].classList.add('active');
            } else {
                screens[key].classList.remove('active');
            }
        });

        navItems.forEach(item => {
            if (item.dataset.screen === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // ページタイトルの更新
        const titles = {
            home: '色日記',
            calendar: '履歴（カレンダー）',
            list: '記録一覧',
            settings: '設定'
        };
        pageTitle.innerText = titles[viewName];

        // 各画面のデータ再描画
        if (viewName === 'calendar') renderCalendar();
        if (viewName === 'list') renderList();
        if (viewName === 'home') checkTodayRecording();
    }

    // --- 日付表示 ---
    function updateDateDisplay() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        dateDisplay.innerText = `${y}.${m}.${d}`;
    }

    // --- 記録機能 ---
    function setupColorPicker() {
        colorPickerContainer.innerHTML = '';
        colors.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.dataset.color = item.color;
            btn.dataset.mood = item.mood;
            btn.style.setProperty('--btn-color', item.color);

            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state.selectedColor = item.color;
                state.selectedMood = item.mood;
                moodText.innerText = state.selectedMood;
            });

            colorPickerContainer.appendChild(btn);
        });
    }

    function checkTodayRecording() {
        // 表示対象の日付（nullなら今日）
        const targetDateStr = state.editingDate || getTodayString();
        const log = state.logs.find(l => l.date === targetDateStr);
        const isToday = targetDateStr === getTodayString();

        // 状態のリセット
        state.selectedColor = null;
        state.selectedMood = null;
        memoArea.value = '';
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        moodText.innerText = '色を選択してください';

        // 編集バッジの制御
        if (state.editingDate) {
            editingDateBadge.innerText = `${state.editingDate.replace(/-/g, '/')} の記録を編集`;
            editingDateBadge.classList.remove('hidden');
            homeTitle.innerText = '気分を記録する';
        } else {
            editingDateBadge.classList.add('hidden');
            homeTitle.innerText = '今日の気分は？';
        }

        if (log) {
            statusCard.classList.add('already-recorded');
            saveBtn.innerText = '更新する';

            // 入力エリアを埋める
            state.selectedColor = log.color;
            state.selectedMood = log.mood;
            memoArea.value = log.memo || '';
            document.querySelectorAll('.color-btn').forEach(btn => {
                if (btn.dataset.color === log.color) btn.classList.add('selected');
            });
            moodText.innerText = log.mood;
        } else {
            statusCard.classList.remove('already-recorded');
            saveBtn.innerText = '保存する';
        }
    }

    function saveLog() {
        if (!state.selectedColor) {
            alert('色を選択してください');
            return;
        }

        const targetDateStr = state.editingDate || getTodayString();
        const existingIndex = state.logs.findIndex(log => log.date === targetDateStr);

        const newLog = {
            id: existingIndex >= 0 ? state.logs[existingIndex].id : crypto.randomUUID(),
            date: targetDateStr,
            color: state.selectedColor,
            mood: state.selectedMood,
            memo: memoArea.value,
            createdAt: existingIndex >= 0 ? state.logs[existingIndex].createdAt : new Date().getTime(),
            updatedAt: new Date().getTime()
        };

        if (existingIndex >= 0) {
            state.logs[existingIndex] = newLog;
        } else {
            state.logs.push(newLog);
            // 日付順にソート（降順）
            state.logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        localStorage.setItem('color_diary_logs', JSON.stringify(state.logs));

        // フィードバック
        saveBtn.innerText = '保存しました！';
        setTimeout(() => {
            state.editingDate = null; // 編集完了後はリセット
            renderCalendar(); // カレンダーを最新の状態に更新
            switchView('home'); // ホーム（今日）に戻る
        }, 1000);
    }

    // --- カレンダー機能 ---
    let calendarDate = new Date();

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();

        calendarMonthText.innerText = `${year}年 ${month + 1}月`;

        // 曜日の見出し
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        days.forEach(d => {
            const div = document.createElement('div');
            div.className = 'calendar-day-head';
            div.innerText = d;
            calendarGrid.appendChild(div);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const todayStr = getTodayString();

        // 空白
        for (let i = 0; i < firstDay; i++) {
            const div = document.createElement('div');
            div.className = 'calendar-cell empty';
            calendarGrid.appendChild(div);
        }

        // 日付
        for (let d = 1; d <= lastDate; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const log = state.logs.find(l => l.date === dateStr);

            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            if (dateStr === todayStr) cell.classList.add('today');

            // 選択中の日付（編集中の日付）を強調
            if (state.editingDate === dateStr) {
                cell.classList.add('selected');
            }

            cell.innerText = d;

            if (log) {
                cell.classList.add('has-data');
                cell.style.backgroundColor = log.color;
                // ホバー時にメモを表示（メモがなければ気分を表示）
                cell.title = log.memo ? `メモ: ${log.memo}` : `気分: ${log.mood}`;
                cell.addEventListener('click', () => showDetail(log));
            } else {
                // 記録がない日もクリックで記録可能に（未来は不可）
                const isFuture = new Date(dateStr) > new Date(todayStr);
                if (!isFuture) {
                    cell.addEventListener('click', () => {
                        state.editingDate = dateStr;
                        renderCalendar(); // 選択枠を更新
                        switchView('home');
                    });
                } else {
                    cell.style.opacity = '0.3';
                    cell.style.cursor = 'default';
                }
            }

            calendarGrid.appendChild(cell);
        }
    }

    // --- モーダル表示 ---
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-modal');

    function showDetail(log) {
        modalBody.innerHTML = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 20px;">${log.date.replace(/-/g, '/')}</h3>
                <div style="background: ${log.color}; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"></div>
                <p style="font-size: 1.2rem; font-weight: 600;">${log.mood}</p>
                <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.05); border-radius: 12px; min-height: 60px;">
                    <p style="color: var(--text-secondary);">${log.memo || 'メモはありません'}</p>
                </div>
                
                <div style="margin-top: 25px; display: flex; gap: 10px; justify-content: center;">
                    <button class="edit-btn" style="background: var(--accent-color); border: none; color: white; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                        色を変更する
                    </button>
                    <button class="delete-btn" style="background: none; border: 1px solid #ff4757; color: #ff4757; padding: 8px 20px; border-radius: 8px; cursor: pointer;">
                        削除
                    </button>
                </div>
            </div>
        `;
        modal.style.display = 'block';

        // 編集ボタン
        modalBody.querySelector('.edit-btn').onclick = () => {
            state.editingDate = log.date;
            renderCalendar(); // カレンダーの選択表示を更新
            modal.style.display = 'none';
            switchView('home');
        };

        const deleteBtn = modalBody.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                if (confirm('この記録を削除してもよろしいですか？')) {
                    state.logs = state.logs.filter(l => l.id !== log.id);
                    localStorage.setItem('color_diary_logs', JSON.stringify(state.logs));
                    modal.style.display = 'none';
                    renderCalendar();
                    renderList();
                }
            };
        }
    }

    // --- 一覧機能 ---
    function renderList() {
        logList.innerHTML = '';

        if (state.logs.length === 0) {
            logList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); margin-top: 40px;">記録がありません</p>';
            return;
        }

        // 月ごとにグループ化するなどの拡張も可能だが、まずはシンプルなリスト
        state.logs.forEach(log => {
            const item = document.createElement('div');
            item.className = 'log-item';
            item.innerHTML = `
                <div class="log-color-indicator" style="background: ${log.color}"></div>
                <div class="log-content">
                    <div class="log-date">${log.date.replace(/-/g, '.')}</div>
                    <div class="log-mood">${log.mood}</div>
                    ${state.settings.enableMemo && log.memo ? `<div class="log-memo">${log.memo}</div>` : ''}
                </div>
            `;
            item.onclick = () => showDetail(log);
            logList.appendChild(item);
        });
    }

    // --- ヘルパー ---
    function getTodayString() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    function setupEventListeners() {
        // 設定変更
        document.getElementById('setting-dark-mode').addEventListener('change', saveSettings);
        document.getElementById('setting-show-mood').addEventListener('change', saveSettings);
        document.getElementById('setting-enable-memo').addEventListener('change', saveSettings);

        // 保存ボタン
        saveBtn.addEventListener('click', saveLog);

        // カレンダー移動
        document.getElementById('prev-month').onclick = () => {
            calendarDate.setMonth(calendarDate.getMonth() - 1);
            renderCalendar();
        };
        document.getElementById('next-month').onclick = () => {
            calendarDate.setMonth(calendarDate.getMonth() + 1);
            renderCalendar();
        };

        // モーダル閉じる
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target == modal) modal.style.display = 'none';
        };
    }

    init();
});
