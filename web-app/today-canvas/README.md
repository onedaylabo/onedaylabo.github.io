
# 今日のキャンバス (Today's Canvas)

ユーザーの「今日の出来事」をAIが解釈し、その日の雰囲気を表現した1枚の4コマ・アートを生成するWebアプリケーションです。

## Webでの公開手順 (GitHub Pages)

このリポジトリをGitHubにプッシュすると、自動的にビルドとデプロイが行われます。

### 1. APIキーの設定 (重要)

GitHub上でアプリを動作させるために、APIキーを「Secrets」として登録する必要があります。

1. GitHubリポジトリの **Settings** タブを開きます。
2. 左メニューの **Secrets and variables** > **Actions** を選択します。
3. **New repository secret** をクリックします。
4. Nameに `API_KEY`、Valueにあなたの [Google AI Studio](https://aistudio.google.com/app/apikey) のキーを入力し、**Add secret** をクリックします。

### 2. GitHub Pages の有効化

1. リポジトリの **Settings** > **Pages** を開きます。
2. **Build and deployment** > **Source** で `GitHub Actions` を選択します。
3. `main` ブランチにコードをプッシュすると、自動的にデプロイが始まります。
4. 数分後、画面上部に表示されるURL（`https://<username>.github.io/<repo>/`）からアプリにアクセスできます。

## ローカルでの開発

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` を `.env` にコピーし、APIキーを入力してください。

```bash
cp .env.example .env
```

### 3. 起動

```bash
npm run dev
```

## 技術スタック

- React 19, TypeScript, Tailwind CSS
- Google Gemini API (Flash-3, Flash-Image-2.5, Live API)

## ライセンス

MIT License
