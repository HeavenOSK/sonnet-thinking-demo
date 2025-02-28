import { Anthropic } from '@anthropic-ai/sdk';
import {
  StreamContentBlock,
  StreamDelta,
  StreamTextBlock,
  StreamThinkingBlock,
} from '../../types/stream';

/**
 * Anthropic APIのモデル名
 */
const MODEL = 'claude-3-7-sonnet-20250219';

/**
 * Thinking機能のトークン予算
 */
const THINKING_BUDGET_TOKENS = 4000;

/**
 * Anthropic APIのシステムプロンプト
 */
const SYSTEM_PROMPT =
  'あなたは役立つAIアシスタントです。ユーザーの質問に対して、正確で有用な回答を提供してください。';

/**
 * Anthropic APIクライアントの初期化
 */
let anthropicClient: Anthropic | null = null;

/**
 * Anthropic APIクライアントの取得
 */
export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    // 環境変数またはローカルストレージからAPIキーを取得
    let apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

    // クライアントサイドの場合、ローカルストレージからAPIキーを取得
    if (typeof window !== 'undefined') {
      const storedApiKey = localStorage.getItem('anthropic-api-key');
      if (storedApiKey) {
        apiKey = storedApiKey;
      }
    }

    if (!apiKey) {
      throw new Error('Anthropic API Keyが設定されていません。');
    }

    anthropicClient = new Anthropic({
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  return anthropicClient;
}

/**
 * ストリーミングイベントハンドラーの型定義
 */
export interface StreamEventHandlers {
  onTextDelta?: (text: string) => void;
  onThinkingDelta?: (thinking: string) => void;
  onComplete?: (contentBlocks: StreamContentBlock[]) => void;
  onError?: (error: Error) => void;
}

/**
 * Anthropic APIストリーミングサービス
 */
export const anthropicStreamService = {
  /**
   * メッセージをストリーミングモードで送信
   */
  async streamMessage(
    message: string,
    conversationHistory: Array<{
      role: 'user' | 'assistant';
      content: string | StreamContentBlock[];
    }> = [],
    handlers: StreamEventHandlers = {},
  ) {
    const client = getAnthropicClient();

    // 会話履歴の構築
    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    try {
      // ストリーミングモードでAPIを呼び出し
      const stream = await client.messages.stream({
        model: MODEL,
        messages,
        system: SYSTEM_PROMPT,
        max_tokens: 16000,
        temperature: 1.0, // Extended Thinking使用時は必ず1.0に設定する必要がある
        thinking: {
          type: 'enabled',
          budget_tokens: THINKING_BUDGET_TOKENS,
        },
      });

      // 完成したコンテンツブロックを保持する配列
      const contentBlocks: StreamContentBlock[] = [];
      let currentTextBlock: StreamTextBlock = { type: 'text', text: '' };
      let currentThinkingBlock: StreamThinkingBlock | null = null;

      // ストリームからのイベントを処理
      for await (const event of stream) {
        console.log(event);
        console.table(event);
        if (event.type === 'content_block_start') {
          // content_block_startイベントの場合、新しいブロックを開始
          if ('content_block' in event && event.content_block) {
            const contentBlock = event.content_block;
            if (contentBlock.type === 'text') {
              currentTextBlock = { type: 'text', text: '' };
            } else if (contentBlock.type === 'thinking') {
              currentThinkingBlock = {
                type: 'thinking',
                thinking: '',
                signature: contentBlock.signature,
              };
            }
          }
        } else if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            currentTextBlock.text += event.delta.text;
            handlers.onTextDelta?.(event.delta.text);
          } else if (event.delta.type === 'thinking_delta') {
            if (currentThinkingBlock) {
              currentThinkingBlock.thinking += event.delta.thinking;
              handlers.onThinkingDelta?.(event.delta.thinking);
            }
          }
        } else if (event.type === 'content_block_stop') {
          // content_block_stopイベントの場合、現在のブロックを配列に追加
          if (currentTextBlock.text) {
            contentBlocks.push(currentTextBlock);
            currentTextBlock = { type: 'text', text: '' };
          }
          if (currentThinkingBlock) {
            contentBlocks.push(currentThinkingBlock);
            currentThinkingBlock = null;
          }
        } else if (event.type === 'message_stop') {
          handlers.onComplete?.(contentBlocks);
        }
      }

      return {
        contentBlocks,
        textContent: this.extractTextFromContentBlocks(contentBlocks),
        thinkingContent: this.extractThinkingFromContentBlocks(contentBlocks),
      };
    } catch (error) {
      console.error('Anthropic API ストリーミング呼び出しエラー:', error);
      handlers.onError?.(error as Error);
      throw new Error('メッセージのストリーミング中にエラーが発生しました。');
    }
  },

  /**
   * コンテンツブロックからテキスト部分のみを抽出
   */
  extractTextFromContentBlocks(contentBlocks: StreamContentBlock[]): string {
    const textBlocks = contentBlocks.filter(
      (block): block is StreamTextBlock => block.type === 'text',
    );

    return textBlocks.map((block) => block.text).join('\n');
  },

  /**
   * コンテンツブロックからthinking部分のみを抽出
   */
  extractThinkingFromContentBlocks(
    contentBlocks: StreamContentBlock[],
  ): string {
    const thinkingBlocks = contentBlocks.filter(
      (block): block is StreamThinkingBlock => block.type === 'thinking',
    );

    return thinkingBlocks.map((block) => block.thinking).join('\n');
  },

  /**
   * コンテンツブロックにthinkingブロックが含まれているかチェック
   */
  hasThinkingBlocks(contentBlocks: StreamContentBlock[]): boolean {
    return contentBlocks.some(
      (block) =>
        block.type === 'thinking' || block.type === 'redacted_thinking',
    );
  },
};
