# Project Brief: Sonnet Thinking

## 概要
このプロジェクトは、Anthropic社の新しいSDK（@anthropic-ai/sdk）を使用して、AIチャットUIを実装するものです。特に、Claudeの新機能である「thinking」機能を活用し、より高度なAIとの対話体験を提供します。

## 目標
- 最新の@anthropic-ai/sdkを使用したチャットUIの実装
- 一般的なAIチャットUIの機能（チャット新規作成、会話履歴、チャットルーム履歴）の実装
- データの永続化にIndexedDBを使用
- UIはTailwind CSSで実装
- SDKの呼び出しは非ストリーミングモードで実装
- Claudeの「thinking」機能を活用した高度な対話体験の提供

## 主要機能
1. **チャット管理**
   - 新規チャットの作成
   - チャットルーム一覧の表示
   - チャット履歴の保存と表示

2. **メッセージ機能**
   - ユーザーメッセージの送信
   - AIレスポンスの表示
   - 「thinking」セクションの表示

3. **データ永続化**
   - IndexedDBを使用したチャットとメッセージの保存
   - アプリ再起動後もデータを維持

4. **UI/UX**
   - レスポンシブデザイン
   - ダークモード対応
   - アクセシビリティ考慮

## 技術スタック
- Next.js 15.1.7
- React 19.0.0
- TypeScript
- Tailwind CSS
- @anthropic-ai/sdk (最新版)
- IndexedDB

## 制約条件
- SDKの呼び出しはストリーミングを使用しないパターンで実装
- UIはTailwind CSS縛りで実装
