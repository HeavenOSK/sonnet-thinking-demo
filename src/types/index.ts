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
  thinking?: string; // assistantメッセージの場合のみ
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
 * Anthropic APIのレスポンス型
 */
export interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
  thinking?: string; // thinking機能で取得した思考プロセス
}
