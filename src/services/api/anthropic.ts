import { Anthropic } from '@anthropic-ai/sdk';
import {
  AnthropicResponse,
  ContentBlock,
  TextBlock,
  ThinkingBlock,
} from '../../types';

/**
 * Anthropic APIのモデル名
 */
const MODEL = 'claude-3-7-sonnet-20250219';

/**
 * Thinking機能のトークン予算
 */
const THINKING_BUDGET_TOKENS = 16000;

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
 * Anthropic APIサービス
 */
export const anthropicService = {
  /**
   * メッセージを送信し、レスポンスを取得
   */
  async sendMessage(
    message: string,
    conversationHistory: Array<{
      role: 'user' | 'assistant';
      content: string | ContentBlock[];
    }> = [],
  ): Promise<AnthropicResponse> {
    const client = getAnthropicClient();

    // 会話履歴の構築
    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    try {
      // thinking機能を有効にしてAPIを呼び出し
      const response = await client.messages.create({
        model: MODEL,
        messages,
        system: SYSTEM_PROMPT,
        max_tokens: 4096,
        temperature: 0.7,
        thinking: {
          type: 'enabled',
          budget_tokens: THINKING_BUDGET_TOKENS,
        },
      });

      return response as unknown as AnthropicResponse;
    } catch (error) {
      console.error('Anthropic API呼び出しエラー:', error);
      throw new Error('メッセージの送信中にエラーが発生しました。');
    }
  },

  /**
   * レスポンスからテキスト部分のみを抽出
   */
  extractTextFromResponse(response: AnthropicResponse): string {
    const textBlocks = response.content.filter(
      (block): block is TextBlock => block.type === 'text',
    );

    return textBlocks.map((block) => block.text).join('\n');
  },

  /**
   * レスポンスからthinking部分のみを抽出
   */
  extractThinkingFromResponse(response: AnthropicResponse): string {
    const thinkingBlocks = response.content.filter(
      (block): block is ThinkingBlock => block.type === 'thinking',
    );

    return thinkingBlocks.map((block) => block.thinking).join('\n');
  },

  /**
   * レスポンスにthinkingブロックが含まれているかチェック
   */
  hasThinkingBlocks(response: AnthropicResponse): boolean {
    return response.content.some(
      (block) =>
        block.type === 'thinking' || block.type === 'redacted_thinking',
    );
  },
};
