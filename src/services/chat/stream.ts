import {
  StreamChat,
  StreamContentBlock,
  StreamMessage,
} from '../../types/stream';
import { anthropicStreamService } from '../api/anthropic-stream';
import { streamDbService } from '../db/stream';

/**
 * ストリーミングチャットサービス
 */
export const streamChatService = {
  /**
   * 新規ストリーミングチャットを作成
   */
  async createStreamChat(title: string): Promise<StreamChat> {
    const now = new Date();
    const chat: StreamChat = {
      id: streamDbService.generateId(),
      title,
      createdAt: now,
      updatedAt: now,
    };

    await streamDbService.saveStreamChat(chat);
    return chat;
  },

  /**
   * ストリーミングチャットのタイトルを更新
   */
  async updateStreamChatTitle(id: string, title: string): Promise<StreamChat> {
    const chat = await streamDbService.getStreamChat(id);

    if (!chat) {
      throw new Error(`ストリーミングチャットが見つかりません: ${id}`);
    }

    const updatedChat: StreamChat = {
      ...chat,
      title,
      updatedAt: new Date(),
    };

    await streamDbService.saveStreamChat(updatedChat);
    return updatedChat;
  },

  /**
   * ストリーミングチャットを削除
   */
  async deleteStreamChat(id: string): Promise<void> {
    await streamDbService.deleteStreamChat(id);
  },

  /**
   * 全てのストリーミングチャットを取得
   */
  async getAllStreamChats(): Promise<StreamChat[]> {
    return streamDbService.getAllStreamChats();
  },

  /**
   * ストリーミングチャットを取得
   */
  async getStreamChat(id: string): Promise<StreamChat | undefined> {
    return streamDbService.getStreamChat(id);
  },

  /**
   * ストリーミングチャットのメッセージを取得
   */
  async getStreamChatMessages(chatId: string): Promise<StreamMessage[]> {
    return streamDbService.getMessagesByStreamChat(chatId);
  },

  /**
   * ユーザーメッセージを送信し、AIレスポンスをストリーミングで取得
   */
  async sendStreamMessage(
    chatId: string,
    userMessage: string,
    handlers: {
      onTextDelta?: (text: string) => void;
      onThinkingDelta?: (thinking: string) => void;
      onComplete?: (message: StreamMessage) => void;
    } = {},
  ): Promise<StreamMessage> {
    // チャットの存在確認
    const chat = await streamDbService.getStreamChat(chatId);
    if (!chat) {
      throw new Error(`ストリーミングチャットが見つかりません: ${chatId}`);
    }

    // チャットの更新日時を更新
    const updatedChat: StreamChat = {
      ...chat,
      updatedAt: new Date(),
    };
    await streamDbService.saveStreamChat(updatedChat);

    // ユーザーメッセージを保存
    const userMessageObj: StreamMessage = {
      id: streamDbService.generateId(),
      chatId,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    await streamDbService.saveStreamMessage(userMessageObj);

    try {
      // 過去のメッセージを取得して会話履歴を構築
      const previousMessages =
        await streamDbService.getMessagesByStreamChat(chatId);
      const conversationHistory = previousMessages
        .filter((msg) => msg.id !== userMessageObj.id) // 今送信したメッセージを除外
        .map((msg) => {
          if (msg.role === 'assistant' && msg.contentBlocks) {
            // assistantメッセージでcontentBlocksがある場合
            return {
              role: msg.role,
              content: msg.contentBlocks,
            };
          }
          // userメッセージまたはcontentBlocksがないassistantメッセージ
          return {
            role: msg.role,
            content: msg.content,
          };
        });

      // AIメッセージのプレースホルダーを作成
      const assistantMessage: StreamMessage = {
        id: streamDbService.generateId(),
        chatId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      // ストリーミングハンドラーを設定
      const streamHandlers = {
        onTextDelta: (text: string) => {
          handlers.onTextDelta?.(text);
        },
        onThinkingDelta: (thinking: string) => {
          handlers.onThinkingDelta?.(thinking);
        },
        onComplete: async (contentBlocks: StreamContentBlock[]) => {
          // ストリーミング完了時にメッセージを更新
          const textContent =
            anthropicStreamService.extractTextFromContentBlocks(contentBlocks);
          const thinkingContent =
            anthropicStreamService.extractThinkingFromContentBlocks(
              contentBlocks,
            );

          const completedMessage: StreamMessage = {
            ...assistantMessage,
            content: textContent,
            contentBlocks,
            thinking: thinkingContent,
          };

          // 完成したメッセージをDBに保存
          await streamDbService.saveStreamMessage(completedMessage);
          handlers.onComplete?.(completedMessage);
        },
        onError: (error: Error) => {
          console.error('ストリーミングエラー:', error);
        },
      };

      // Anthropic APIをストリーミングモードで呼び出し
      await anthropicStreamService.streamMessage(
        userMessage,
        conversationHistory,
        streamHandlers,
      );

      return assistantMessage;
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      throw new Error('メッセージの送信中にエラーが発生しました。');
    }
  },

  /**
   * 完了したメッセージを保存
   */
  async saveCompletedMessage(message: StreamMessage): Promise<void> {
    await streamDbService.saveStreamMessage(message);
  },
};
