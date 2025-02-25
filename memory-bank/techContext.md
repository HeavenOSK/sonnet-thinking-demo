# Tech Context: Sonnet Thinking

## 使用技術

### フロントエンド
- **Next.js 15.1.7**: Reactベースのフレームワーク
- **React 19.0.0**: UIライブラリ
- **TypeScript**: 型安全性を確保するための言語
- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク

### API連携
- **@anthropic-ai/sdk**: Anthropic APIとの連携
- **非ストリーミングモード**: ストリーミングを使用しない実装

### データ永続化
- **IndexedDB**: ブラウザ内データベース
- **idb**: IndexedDBを簡単に扱うためのライブラリ

### 開発ツール
- **Biome**: リンターとフォーマッター
- **TypeScript**: 静的型チェック

## 開発環境

### 必要条件
- Node.js 18.x以上
- npm 9.x以上またはyarn 1.22.x以上

### 開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

### リント
```bash
npm run lint
npm run lint:fix
```

## 技術的制約

### Anthropic API
- APIキーが必要
- 適切なレート制限の考慮
- 非ストリーミングモードでの実装

### IndexedDB
- ブラウザ環境でのみ動作
- 容量制限あり（ブラウザによって異なる）
- 非同期APIのみ

### Next.js
- App Routerの使用
- サーバーコンポーネントとクライアントコンポーネントの適切な使い分け

### Tailwind CSS
- ユーティリティクラスの使用
- カスタムデザインの実装

## 依存関係

### 本番環境
- @anthropic-ai/sdk: Anthropic APIクライアント
- next: Webフレームワーク
- react: UIライブラリ
- react-dom: DOMレンダリング
- idb: IndexedDB操作ライブラリ

### 開発環境
- @types/node: Node.js型定義
- @types/react: React型定義
- @types/react-dom: ReactDOM型定義
- postcss: CSSプロセッサー
- tailwindcss: CSSフレームワーク
- typescript: 型チェッカー
- @biomejs/biome: リンターとフォーマッター

## API設定

### Anthropic API
- モデル: claude-3-7-sonnet-20250219（最新の適切なモデル）
- 最大トークン: 適切な値を設定
- 温度: 適切な値を設定（デフォルト: 0.7）
- トップP: 適切な値を設定（デフォルト: 0.9）
- Extended Thinking: 有効化
  - budget_tokens: 16000（推奨値）
  - 複雑な推論タスクに対して拡張された思考能力を提供
  - thinking/redacted_thinkingブロックの適切な処理

## パフォーマンス考慮事項
- メッセージリストの仮想化（長いチャット履歴の場合）
- 画像の最適化
- コンポーネントのメモ化
- IndexedDBの効率的な使用

## セキュリティ考慮事項
- APIキーの安全な管理
- ユーザーデータの適切な保護
- XSS対策
- CSP（Content Security Policy）の設定

## アクセシビリティ考慮事項
- WAI-ARIA準拠
- キーボードナビゲーション
- スクリーンリーダー対応
- 色のコントラスト比の確保

## ブラウザ互換性
- モダンブラウザ（Chrome, Firefox, Safari, Edge）をサポート
- IndexedDBをサポートするブラウザが必要
