import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Chat, Message } from '../../types';

/**
 * データベース名
 */
const DB_NAME = 'sonnet-thinking-db';

/**
 * データベースバージョン
 */
const DB_VERSION = 1;

/**
 * IndexedDBのスキーマ定義
 */
interface SonnetThinkingDB extends DBSchema {
  chats: {
    key: string;
    value: Chat;
    indexes: {
      'by-updated-at': Date;
    };
  };
  messages: {
    key: string;
    value: Message;
    indexes: {
      'by-chat-id': string;
      'by-timestamp': Date;
    };
  };
}

/**
 * データベースへの接続を取得
 */
export async function getDB(): Promise<IDBPDatabase<SonnetThinkingDB>> {
  return openDB<SonnetThinkingDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // チャットストアの作成
      const chatStore = db.createObjectStore('chats', { keyPath: 'id' });
      chatStore.createIndex('by-updated-at', 'updatedAt');

      // メッセージストアの作成
      const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
      messageStore.createIndex('by-chat-id', 'chatId');
      messageStore.createIndex('by-timestamp', 'timestamp');
    },
  });
}

/**
 * データベースサービス
 */
export const dbService = {
  /**
   * チャットの取得
   */
  async getChat(id: string): Promise<Chat | undefined> {
    const db = await getDB();
    return db.get('chats', id);
  },

  /**
   * 全てのチャットを取得
   */
  async getAllChats(): Promise<Chat[]> {
    const db = await getDB();
    return db.getAllFromIndex('chats', 'by-updated-at');
  },

  /**
   * チャットの保存
   */
  async saveChat(chat: Chat): Promise<string> {
    const db = await getDB();
    await db.put('chats', chat);
    return chat.id;
  },

  /**
   * チャットの削除
   */
  async deleteChat(id: string): Promise<void> {
    const db = await getDB();
    // チャットの削除
    await db.delete('chats', id);
    
    // 関連するメッセージの削除
    const messages = await this.getMessagesByChat(id);
    const tx = db.transaction('messages', 'readwrite');
    await Promise.all(
      messages.map((message) => tx.store.delete(message.id))
    );
    await tx.done;
  },

  /**
   * メッセージの取得
   */
  async getMessage(id: string): Promise<Message | undefined> {
    const db = await getDB();
    return db.get('messages', id);
  },

  /**
   * チャットに属するメッセージの取得
   */
  async getMessagesByChat(chatId: string): Promise<Message[]> {
    const db = await getDB();
    return db.getAllFromIndex('messages', 'by-chat-id', chatId);
  },

  /**
   * メッセージの保存
   */
  async saveMessage(message: Message): Promise<string> {
    const db = await getDB();
    await db.put('messages', message);
    return message.id;
  },

  /**
   * メッセージの削除
   */
  async deleteMessage(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('messages', id);
  },
};
