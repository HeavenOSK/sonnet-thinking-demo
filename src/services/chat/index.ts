import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../db';
import { anthropicService } from '../api/anthropic';
import { Chat, Message, NewChat, ContentBlock } from '../../types';

/**
 * チャットサービス
 */
export const chatService = {
  /**
   * 新規チャットを作成
   */
  async createChat(title: string): Promise<Chat> {
    const now = new Date();
    const chat: Chat = {
      id: uuidv4(),
      title,
      createdAt: now,
      updatedAt: now,
    };
    
    await dbService.saveChat(chat);
    return chat;
  },
  
  /**
   * チャットのタイトルを更新
   */
  async updateChatTitle(id: string, title: string): Promise<Chat> {
    const chat = await dbService.getChat(id);
    
    if (!chat) {
      throw new Error(`チャットが見つかりません: ${id}`);
    }
    
    const updatedChat: Chat = {
      ...chat,
      title,
      updatedAt: new Date(),
    };
    
    await dbService.saveChat(updatedChat);
    return updatedChat;
  },
  
  /**
   * チャットを削除
   */
  async deleteChat(id: string): Promise<void> {
    await dbService.deleteChat(id);
  },
  
  /**
   * 全てのチャットを取得
   */
  async getAllChats(): Promise<Chat[]> {
    return dbService.getAllChats();
  },
  
  /**
   * チャットを取得
   */
  async getChat(id: string): Promise<Chat | undefined> {
    return dbService.getChat(id);
  },
  
  /**
   * チャットのメッセージを取得
   */
  async getChatMessages(chatId: string): Promise<Message[]> {
    return dbService.getMessagesByChat(chatId);
  },
  
  /**
   * ユーザーメッセージを送信し、AIレスポンスを取得
   */
  async sendMessage(chatId: string, userMessage: string): Promise<Message[]> {
    // チャットの存在確認
    const chat = await dbService.getChat(chatId);
    if (!chat) {
      throw new Error(`チャットが見つかりません: ${chatId}`);
    }
    
    // チャットの更新日時を更新
    const updatedChat: Chat = {
      ...chat,
      updatedAt: new Date(),
    };
    await dbService.saveChat(updatedChat);
    
    // ユーザーメッセージを保存
    const userMessageObj: Message = {
      id: uuidv4(),
      chatId,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    await dbService.saveMessage(userMessageObj);
    
    try {
      // 過去のメッセージを取得して会話履歴を構築
      const previousMessages = await dbService.getMessagesByChat(chatId);
      const conversationHistory = previousMessages
        .filter(msg => msg.id !== userMessageObj.id) // 今送信したメッセージを除外
        .map(msg => {
          if (msg.role === 'assistant' && msg.contentBlocks) {
            // assistantメッセージでcontentBlocksがある場合
            return {
              role: msg.role,
              content: msg.contentBlocks,
            };
          } else {
            // userメッセージまたはcontentBlocksがないassistantメッセージ
            return {
              role: msg.role,
              content: msg.content,
            };
          }
        });
      
      // Anthropic APIを呼び出し
      const response = await anthropicService.sendMessage(userMessage, conversationHistory);
      
      // レスポンスからテキスト部分を抽出
      const textContent = anthropicService.extractTextFromResponse(response);
      
      // AIレスポンスを保存
      const assistantMessage: Message = {
        id: uuidv4(),
        chatId,
        role: 'assistant',
        content: textContent,
        contentBlocks: response.content, // 構造化されたコンテンツブロックを保存
        timestamp: new Date(),
      };
      await dbService.saveMessage(assistantMessage);
      
      return [userMessageObj, assistantMessage];
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
      throw new Error('メッセージの送信中にエラーが発生しました。');
    }
  },
};
