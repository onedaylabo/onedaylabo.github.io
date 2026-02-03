
# 今日のキャンバス (Today's Canvas)

ユーザーの「今日の出来事」をAIが解釈し、その日の雰囲気を表現した1枚の4コマ・アートを生成するWebアプリケーションです。

## 特徴

- **エモーショナルな生成**: 単なる事実の絵画化ではなく、感情や空気感を重視。
- **4コマ構成**: 一日の流れ（朝、昼、夕、夜など）を表現する4つのパネルで構成。
- **音声入力対応**: 日記を書くのが面倒な時でも、声で出来事を記録できます。
- **洗練されたデザイン**: 高級感のあるミニマルなUI、ダークモード対応。

## 技術スタック

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (@google/genai)
  - `gemini-3-flash-preview`: テキストの解析とプロンプト生成
  - `gemini-2.5-flash-image`: 画像生成
  - `gemini-2.5-flash-native-audio-preview`: 音声文字起こし (Live API)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. APIキーの設定

`.env.example` を `.env` にコピーし、自分のAPIキーを入力してください。

```bash
cp .env.example .env
```

`API_KEY` は [Google AI Studio](https://aistudio.google.com/app/apikey) から取得できます。

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 公開・デプロイ

### GitHub Pages へのデプロイ

1. `package.json` に `"homepage": "https://<your-username>.github.io/<repo-name>"` を追加します。
2. ビルドを実行します。
   ```bash
   npm run build
   ```
3. `dist` フォルダの内容を `gh-pages` ブランチにプッシュするか、GitHub Actionsを使用して自動デプロイ設定を行ってください。

## ライセンス

MIT License
