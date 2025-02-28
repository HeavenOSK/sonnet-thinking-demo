import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { StreamChat, StreamMessage } from '../../types/stream';

/**
 * データベース名
 */
const DB_NAME = 'sonnet-thinking-stream';

/**
 * データベースバージョン
 */
const DB_VERSION = 1;

/**
 * ストアの名前
 */
const STORES = {
  CHATS: 'stream-chats',
  MESSAGES: 'stream-messages',
};

/**
 * データベースの初期化
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // チャットストアの作成
      if (!db.objectStoreNames.contains(STORES.CHATS)) {
        const chatStore = db.createObjectStore(STORES.CHATS, { keyPath: 'id' });
        chatStore.createIndex('updatedAt', 'updatedAt');
      }

      // メッセージストアの作成
      if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
        const messageStore = db.createObjectStore(STORES.MESSAGES, {
          keyPath: 'id',
        });
        messageStore.createIndex('chatId', 'chatId');
        messageStore.createIndex('timestamp', 'timestamp');
      }
    },
  });
}

/**
 * ストリーミングDBサービス
 */
export const streamDbService = {
  /**
   * ストリーミングチャットを保存
   */
  async saveStreamChat(chat: StreamChat): Promise<void> {
    const db = await initDB();
    await db.put(STORES.CHATS, chat);
  },

  /**
   * ストリーミングチャットを取得
   */
  async getStreamChat(id: string): Promise<StreamChat | undefined> {
    const db = await initDB();
    return db.get(STORES.CHATS, id);
  },

  /**
   * 全てのストリーミングチャットを取得
   */
  async getAllStreamChats(): Promise<StreamChat[]> {
    const db = await initDB();
    return db.getAllFromIndex(STORES.CHATS, 'updatedAt');
  },

  /**
   * ストリーミングチャットを削除
   */
  async deleteStreamChat(id: string): Promise<void> {
    const db = await initDB();
    await db.delete(STORES.CHATS, id);

    // 関連するメッセージも削除
    const messages = await this.getMessagesByStreamChat(id);
    const tx = db.transaction(STORES.MESSAGES, 'readwrite');
    for (const message of messages) {
      await tx.store.delete(message.id);
    }
    await tx.done;
  },

  /**
   * ストリーミングメッセージを保存
   */
  async saveStreamMessage(message: StreamMessage): Promise<void> {
    const db = await initDB();
    await db.put(STORES.MESSAGES, message);
  },

  /**
   * ストリーミングメッセージを取得
   */
  async getStreamMessage(id: string): Promise<StreamMessage | undefined> {
    const db = await initDB();
    return db.get(STORES.MESSAGES, id);
  },

  /**
   * ストリーミングチャットに属するメッセージを取得
   */
  async getMessagesByStreamChat(chatId: string): Promise<StreamMessage[]> {
    const db = await initDB();
    const messages = await db.getAllFromIndex(
      STORES.MESSAGES,
      'chatId',
      chatId,
    );
    return messages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  },

  /**
   * ストリーミングメッセージを削除
   */
  async deleteStreamMessage(id: string): Promise<void> {
    const db = await initDB();
    await db.delete(STORES.MESSAGES, id);
  },

  /**
   * 新しいIDを生成
   */
  generateId(): string {
    return uuidv4();
  },
};
