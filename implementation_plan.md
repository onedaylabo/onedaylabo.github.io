# OneDayLabo トップページ自動生成システム 実装プラン

GitHub Pages 上のトップページを自動生成し、`/web-app/` 配下のアプリを自動的にリストアップする仕組みを構築します。

## 1. ディレクトリ構造の整理
- 既存のアプリを `web-app/` ディレクトリ配下に移動（完了）
- 以下の管理用ファイルをルートに作成:
  - `index.html`: トップページテンプレート
  - `apps.json`: アプリ一覧データ（自動生成）
  - `.github/workflows/update-index.yml`: GitHub Actions 設定
  - `scripts/update_list.js`: 更新用スクリプト

## 2. 自動生成スクリプト (`scripts/update_list.js`)
- `web-app/` 配下のディレクトリをスキャン
- 各ディレクトリの `index.html` の有無を確認
- `apps.json` を生成/更新
- `index.html` の中のアプリリスト部分を動的に置換、またはテンプレートから生成

## 3. デザイン (`index.html` & `style.css`)
- **コンセプト**: シンプル、高級感、清潔感
- **配色**: 白背景、濃紺またはダークグレーのテキスト、アクセントに柔らかなブルー
- **タイポグラフィ**: Inter または Noto Sans JP
- **レイアウト**: 中央寄せ、十分な余白、カード形式のリンクリスト

## 4. GitHub Actions 設定 (`.github/workflows/update-index.yml`)
- トリガー: `web-app/**` への push
- アクション:
  1. チェックアウト
  2. Node.js セットアップ
  3. スクリプト実行 (`node scripts/update_list.js`)
  4. 変更があれば commit & push

## 5. 拡張性の考慮
- 各アプリフォルダに `app-config.json` を置くことで、表示名やアイコン、説明文を個別に設定できるようにする

---

まずは、スクリプトと `index.html` のテンプレート作成から開始します。
