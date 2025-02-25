/**
 * チャットの型定義
 */
export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * メッセージの役割
 */
export type MessageRole = 'user' | 'assistant';

/**
 * メッセージの型定義
 */
export interface Message {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  contentBlocks?: ContentBlock[]; // assistantメッセージの場合のみ、構造化されたコンテンツブロック
  timestamp: Date;
}

/**
 * 新規チャット作成用の型
 */
export type NewChat = Omit<Chat, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 新規メッセージ作成用の型
 */
export type NewMessage = Omit<Message, 'id' | 'timestamp'>;

/**
 * Anthropic APIのコンテンツブロック型
 */
export type ContentBlock = TextBlock | ThinkingBlock | RedactedThinkingBlock;

/**
 * テキストブロック型
 */
export interface TextBlock {
  type: 'text';
  text: string;
}

/**
 * Thinking（思考）ブロック型
 */
export interface ThinkingBlock {
  type: 'thinking';
  thinking: string;
  signature: string;
}

/**
 * 編集されたThinking（思考）ブロック型
 */
export interface RedactedThinkingBlock {
  type: 'redacted_thinking';
  data: string;
}

/**
 * Anthropic APIのレスポンス型
 */
export interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: ContentBlock[];
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}
