/**
 * ストリーミングチャットの型定義
 */
export interface StreamChat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ストリーミングメッセージの役割
 */
export type StreamMessageRole = 'user' | 'assistant';

/**
 * ストリーミングメッセージの型定義
 */
export interface StreamMessage {
  id: string;
  chatId: string;
  role: StreamMessageRole;
  content: string;
  contentBlocks?: StreamContentBlock[]; // assistantメッセージの場合のみ、構造化されたコンテンツブロック
  thinking?: string; // 思考プロセス
  timestamp: Date;
}

/**
 * 新規ストリーミングチャット作成用の型
 */
export type NewStreamChat = Omit<StreamChat, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 新規ストリーミングメッセージ作成用の型
 */
export type NewStreamMessage = Omit<StreamMessage, 'id' | 'timestamp'>;

/**
 * ストリーミングコンテンツブロック型
 */
export type StreamContentBlock = StreamTextBlock | StreamThinkingBlock | StreamRedactedThinkingBlock;

/**
 * ストリーミングテキストブロック型
 */
export interface StreamTextBlock {
  type: 'text';
  text: string;
}

/**
 * ストリーミングThinking（思考）ブロック型
 */
export interface StreamThinkingBlock {
  type: 'thinking';
  thinking: string;
  signature: string;
}

/**
 * ストリーミング編集されたThinking（思考）ブロック型
 */
export interface StreamRedactedThinkingBlock {
  type: 'redacted_thinking';
  data: string;
}

/**
 * ストリーミングデルタ型
 */
export interface StreamDelta {
  type: 'text_delta' | 'thinking_delta';
  text?: string;
  thinking?: string;
}

/**
 * ストリーミング状態の型定義
 */
export interface StreamState {
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking: string;
}
