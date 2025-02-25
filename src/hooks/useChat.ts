import { useCallback, useEffect, useState } from 'react';
import { chatService } from '../services/chat';
import { Chat, Message } from '../types';

/**
 * チャット機能を使用するためのカスタムフック
 */
export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 全てのチャットを取得
   */
  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedChats = await chatService.getAllChats();
      setChats(fetchedChats);
      setError(null);
    } catch (err) {
      console.error('チャット取得エラー:', err);
      setError('チャットの取得中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 特定のチャットのメッセージを取得
   */
  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      const fetchedMessages = await chatService.getChatMessages(chatId);
      setMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      console.error('メッセージ取得エラー:', err);
      setError('メッセージの取得中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 新規チャットを作成
   */
  const createChat = useCallback(async (title: string) => {
    try {
      setLoading(true);
      const newChat = await chatService.createChat(title);
      setChats((prevChats) => [...prevChats, newChat]);
      setCurrentChat(newChat);
      setMessages([]);
      setError(null);
      return newChat;
    } catch (err) {
      console.error('チャット作成エラー:', err);
      setError('チャットの作成中にエラーが発生しました。');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * チャットを選択
   */
  const selectChat = useCallback(
    async (chatId: string) => {
      try {
        setLoading(true);
        const chat = await chatService.getChat(chatId);
        if (chat) {
          setCurrentChat(chat);
          await fetchMessages(chatId);
        } else {
          setError('指定されたチャットが見つかりません。');
        }
      } catch (err) {
        console.error('チャット選択エラー:', err);
        setError('チャットの選択中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    },
    [fetchMessages],
  );

  /**
   * チャットのタイトルを更新
   */
  const updateChatTitle = useCallback(
    async (chatId: string, title: string) => {
      try {
        setLoading(true);
        const updatedChat = await chatService.updateChatTitle(chatId, title);
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? updatedChat : chat)),
        );
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat);
        }
        setError(null);
      } catch (err) {
        console.error('チャットタイトル更新エラー:', err);
        setError('チャットタイトルの更新中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    },
    [currentChat],
  );

  /**
   * チャットを削除
   */
  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        setLoading(true);
        await chatService.deleteChat(chatId);
        setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
          setMessages([]);
        }
        setError(null);
      } catch (err) {
        console.error('チャット削除エラー:', err);
        setError('チャットの削除中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    },
    [currentChat],
  );

  /**
   * メッセージを送信
   */
  const sendMessage = useCallback(
    async (message: string) => {
      if (!currentChat) {
        setError('チャットが選択されていません。');
        return;
      }

      try {
        setLoading(true);
        const [userMessage, assistantMessage] = await chatService.sendMessage(
          currentChat.id,
          message,
        );
        setMessages((prevMessages) => [
          ...prevMessages,
          userMessage,
          assistantMessage,
        ]);
        setError(null);
      } catch (err) {
        console.error('メッセージ送信エラー:', err);
        setError('メッセージの送信中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    },
    [currentChat],
  );

  // 初期化時に全てのチャットを取得
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats,
    currentChat,
    messages,
    loading,
    error,
    fetchChats,
    fetchMessages,
    createChat,
    selectChat,
    updateChatTitle,
    deleteChat,
    sendMessage,
  };
}
