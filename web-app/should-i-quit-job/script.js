const questions = [
    // ① 心身・メンタル状態 (Category 0)
    { text: "仕事のことを考えると気分が沈む", category: "心身・メンタル", catIndex: 0 },
    { text: "休日でも仕事のことが頭から離れない", category: "心身・メンタル", catIndex: 0 },
    { text: "朝起きた瞬間に「行きたくない」と感じる", category: "心身・メンタル", catIndex: 0 },
    { text: "最近、疲れが取れにくいと感じる", category: "心身・メンタル", catIndex: 0 },
    { text: "仕事が原因で体調を崩したことがある", category: "心身・メンタル", catIndex: 0 },

    // ② 仕事内容・やりがい (Category 1)
    { text: "今の仕事にやりがいを感じられない", category: "仕事内容・やりがい", catIndex: 1 },
    { text: "成長している実感がほとんどない", category: "仕事内容・やりがい", catIndex: 1 },
    { text: "仕事内容が単調、または意味を感じにくい", category: "仕事内容・やりがい", catIndex: 1 },
    { text: "自分の強みが活かされていないと感じる", category: "仕事内容・やりがい", catIndex: 1 },
    { text: "他の仕事の方が向いている気がする", category: "仕事内容・やりがい", catIndex: 1 },

    // ③ 人間関係・職場環境 (Category 2)
    { text: "職場で気を遣いすぎて疲れる", category: "人間関係・環境", catIndex: 2 },
    { text: "上司との関係に強いストレスを感じる", category: "人間関係・環境", catIndex: 2 },
    { text: "同僚に相談できる人がいない", category: "人間関係・環境", catIndex: 2 },
    { text: "理不尽だと感じる指示や評価が多い", category: "人間関係・環境", catIndex: 2 },
    { text: "職場の雰囲気が自分に合っていない", category: "人間関係・環境", catIndex: 2 },

    // ④ 労働条件・働き方 (Category 3)
    { text: "残業や拘束時間が多すぎる", category: "労働条件・働き方", catIndex: 3 },
    { text: "休みを取っても仕事の連絡が来る", category: "労働条件・働き方", catIndex: 3 },
    { text: "ワークライフバランスが崩れている", category: "労働条件・働き方", catIndex: 3 },
    { text: "働き方を変えたいが改善される見込みがない", category: "労働条件・働き方", catIndex: 3 },
    { text: "今の働き方を長く続けるのは無理だと感じる", category: "労働条件・働き方", catIndex: 3 },

    // ⑤ 将来性・キャリア不安 (Category 4)
    { text: "この会社での将来が想像できない", category: "将来性・キャリア", catIndex: 4 },
    { text: "今の仕事が将来のキャリアにつながる気がしない", category: "将来性・キャリア", catIndex: 4 },
    { text: "市場価値が上がっていないと感じる", category: "将来性・キャリア", catIndex: 4 },
    { text: "数年後に後悔していそうな気がする", category: "将来性・キャリア", catIndex: 4 },
    { text: "転職した方が可能性が広がる気がする", category: "将来性・キャリア", catIndex: 4 },

    // ⑥ 生活・お金・価値観 (Category 5)
    { text: "給料に見合っていないと感じる", category: "生活・お金・価値観", catIndex: 5 },
    { text: "生活のためだけに働いている感覚がある", category: "生活・お金・価値観", catIndex: 5 },
    { text: "お金以外の理由で今の仕事を続けている", category: "生活・お金・価値観", catIndex: 5 },
    { text: "本当は別の生き方をしたいと思っている", category: "生活・お金・価値観", catIndex: 5 },
    { text: "「このままでいいのか」と頻繁に考える", category: "生活・お金・価値観", catIndex: 5 }
];

let currentQuestionIndex = 0;
let answers = [];

const homeSection = document.getElementById('home-section');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const categoryLabel = document.getElementById('category-label');
const progressBarFill = document.getElementById('progress-bar-fill');
const radioOptions = document.getElementsByName('answer');

// Start Quiz
startBtn.addEventListener('click', () => {
    homeSection.style.display = 'none';
    quizSection.style.display = 'block';
    quizSection.classList.add('fade-in');
    showQuestion();
});

// Show Question
function showQuestion() {
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.text;
    categoryLabel.textContent = `STEP ${currentQuestionIndex + 1} / ${questions.length} • ${q.category}`;

    // Reset selection
    radioOptions.forEach(opt => opt.checked = false);

    // Update progress
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBarFill.style.width = `${progress}%`;
}

// Option selection - Auto advance
radioOptions.forEach(opt => {
    opt.addEventListener('change', () => {
        const selectedValue = parseInt(opt.value);
        answers.push(selectedValue);

        currentQuestionIndex++;

        // Add a small delay for visual feedback
        setTimeout(() => {
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                showResults();
            }
        }, 200);
    });
});

// Calculate Results
function showResults() {
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');

    const totalScore = answers.reduce((a, b) => a + b, 0);
    const maxScore = questions.length * 5; // 30問 × 5点 = 150点

    // Mental specific score
    const mentalScore = answers.slice(0, 5).reduce((a, b) => a + b, 0);
    const hasMentalRedFlag = mentalScore >= 20;

    document.getElementById('total-score').innerHTML = `<span style="font-size: 0.9rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem;">総合負担スコア</span>${totalScore}<span style="font-size: 1.25rem; color: var(--text-secondary); font-weight: 300; margin-left: 8px;">/ ${maxScore}</span>`;

    let result = {
        title: "",
        tag: "",
        tagClass: "",
        message: "",
        advice: []
    };

    if (totalScore <= 60) {
        result.title = "今はまだ、辞める時ではないかもしれません";
        result.tag = "現状維持・改善";
        result.tagClass = "tag-safe";
        result.message = "現状に対する不満は一時的なものか、環境の微調整で解決できる可能性が高いです。今の職場で得られる経験やスキル、安定性を再評価してみましょう。";
        result.advice = [
            "不満の正体を書き出してみる",
            "上司や同僚に小さな改善を提案してみる",
            "週末に仕事のことを完全に忘れる時間を作る"
        ];
    } else if (totalScore <= 90) {
        result.title = "慎重に検討・準備を始める段階です";
        result.tag = "検討段階";
        result.tagClass = "tag-warning";
        result.message = "仕事に対する違和感が蓄積されています。すぐに辞める必要はありませんが、自分のキャリアビジョンを見直し、外の世界にも目を向けて情報を集め始めるべき時期です。";
        result.advice = [
            "自分のスキルを棚卸ししてみる",
            "転職サイトに登録して市場価値を把握する",
            "3年後、5年後の自分がどうなっていたいか考える"
        ];
    } else if (totalScore <= 120) {
        result.title = "退職の判断は合理的。行動に移しましょう";
        result.tag = "退職・転職推奨";
        result.tagClass = "tag-warning";
        result.message = "あなたは今の職場環境に限界を感じており、その判断は客観的にも妥当だと言えます。今の場所に留まることで失う機会損失の方が大きくなっているかもしれません。";
        result.advice = [
            "具体的な転職活動のスケジュールを立てる",
            "信頼できるエージェントや知人に相談する",
            "「辞めること」への罪悪感を捨てる"
        ];
    } else {
        result.title = "環境的に危険信号。最優先で自分を守って";
        result.tag = "即時行動・脱出";
        result.tagClass = "tag-warning";
        result.message = "職場環境が非常に過酷か、あなたにとって極めて相性が悪い状態です。頑張りすぎは禁物です。合理的な判断を下せるうちに、退職や休職を含めた環境の変化を模索してください。";
        result.advice = [
            "まずはまとまった休みを取って心身を休める",
            "退職代行など、心理的負担を減らす方法も検討する",
            "他人の目ではなく、自分の心身の健康を最優先にする"
        ];
    }

    // Display
    document.getElementById('result-title').textContent = result.title;
    const tagEl = document.getElementById('result-tag');
    tagEl.textContent = result.tag;
    tagEl.className = `result-tag ${result.tagClass}`;
    document.getElementById('result-message').textContent = result.message;

    const adviceList = document.getElementById('advice-list');
    adviceList.innerHTML = '';
    result.advice.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.marginBottom = "0.5rem";
        adviceList.appendChild(li);
    });

    // Special Mental Warning
    if (hasMentalRedFlag) {
        document.getElementById('special-warning').style.display = 'block';
    } else {
        document.getElementById('special-warning').style.display = 'none';
    }
}

// Restart
restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    answers = [];
    resultSection.style.display = 'none';
    homeSection.style.display = 'block';
    homeSection.classList.add('fade-in');
});
