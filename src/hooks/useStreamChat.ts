import { useCallback, useEffect, useState } from 'react';
import { streamChatService } from '../services/chat/stream';
import { StreamChat, StreamMessage } from '../types/stream';

/**
 * ストリーミングチャット機能を使用するためのカスタムフック
 */
export function useStreamChat() {
  const [streamChats, setStreamChats] = useState<StreamChat[]>([]);
  const [currentStreamChat, setCurrentStreamChat] = useState<StreamChat | null>(null);
  const [streamMessages, setStreamMessages] = useState<StreamMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [streamingThinking, setStreamingThinking] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  /**
   * 全てのストリーミングチャットを取得
   */
  const fetchStreamChats = useCallback(async () => {
    try {
      setIsStreaming(true);
      const fetchedChats = await streamChatService.getAllStreamChats();
      setStreamChats(fetchedChats);
      setError(null);
    } catch (err) {
      console.error('ストリーミングチャット取得エラー:', err);
      setError('ストリーミングチャットの取得中にエラーが発生しました。');
    } finally {
      setIsStreaming(false);
    }
  }, []);

  /**
   * 特定のストリーミングチャットのメッセージを取得
   */
  const fetchStreamMessages = useCallback(async (chatId: string) => {
    try {
      setIsStreaming(true);
      const fetchedMessages = await streamChatService.getStreamChatMessages(chatId);
      setStreamMessages(fetchedMessages);
      setError(null);
    } catch (err) {
      console.error('ストリーミングメッセージ取得エラー:', err);
      setError('ストリーミングメッセージの取得中にエラーが発生しました。');
    } finally {
      setIsStreaming(false);
    }
  }, []);

  /**
   * 新規ストリーミングチャットを作成
   */
  const createStreamChat = useCallback(async (title: string) => {
    try {
      setIsStreaming(true);
      const newChat = await streamChatService.createStreamChat(title);
      setStreamChats((prevChats) => [...prevChats, newChat]);
      setCurrentStreamChat(newChat);
      setStreamMessages([]);
      setError(null);
      return newChat;
    } catch (err) {
      console.error('ストリーミングチャット作成エラー:', err);
      setError('ストリーミングチャットの作成中にエラーが発生しました。');
      return null;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  /**
   * ストリーミングチャットを選択
   */
  const selectStreamChat = useCallback(
    async (chatId: string) => {
      try {
        setIsStreaming(true);
        const chat = await streamChatService.getStreamChat(chatId);
        if (chat) {
          setCurrentStreamChat(chat);
          await fetchStreamMessages(chatId);
        } else {
          setError('指定されたストリーミングチャットが見つかりません。');
        }
      } catch (err) {
        console.error('ストリーミングチャット選択エラー:', err);
        setError('ストリーミングチャットの選択中にエラーが発生しました。');
      } finally {
        setIsStreaming(false);
      }
    },
    [fetchStreamMessages],
  );

  /**
   * ストリーミングチャットのタイトルを更新
   */
  const updateStreamChatTitle = useCallback(
    async (chatId: string, title: string) => {
      try {
        setIsStreaming(true);
        const updatedChat = await streamChatService.updateStreamChatTitle(chatId, title);
        setStreamChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? updatedChat : chat)),
        );
        if (currentStreamChat?.id === chatId) {
          setCurrentStreamChat(updatedChat);
        }
        setError(null);
      } catch (err) {
        console.error('ストリーミングチャットタイトル更新エラー:', err);
        setError('ストリーミングチャットタイトルの更新中にエラーが発生しました。');
      } finally {
        setIsStreaming(false);
      }
    },
    [currentStreamChat],
  );

  /**
   * ストリーミングチャットを削除
   */
  const deleteStreamChat = useCallback(
    async (chatId: string) => {
      try {
        setIsStreaming(true);
        await streamChatService.deleteStreamChat(chatId);
        setStreamChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
        if (currentStreamChat?.id === chatId) {
          setCurrentStreamChat(null);
          setStreamMessages([]);
        }
        setError(null);
      } catch (err) {
        console.error('ストリーミングチャット削除エラー:', err);
        setError('ストリーミングチャットの削除中にエラーが発生しました。');
      } finally {
        setIsStreaming(false);
      }
    },
    [currentStreamChat],
  );

  /**
   * ストリーミングメッセージを送信
   */
  const sendStreamMessage = useCallback(
    async (message: string) => {
      if (!currentStreamChat) {
        setError('ストリーミングチャットが選択されていません。');
        return;
      }

      try {
        // ストリーミング状態をリセット
        setIsStreaming(true);
        setStreamingContent('');
        setStreamingThinking('');

        // ユーザーメッセージをUIに追加
        const userMessage: StreamMessage = {
          id: 'temp-user-' + Date.now(),
          chatId: currentStreamChat.id,
          role: 'user',
          content: message,
          timestamp: new Date(),
        };
        setStreamMessages((prev) => [...prev, userMessage]);

        // ストリーミングハンドラーを設定
        const handlers = {
          onTextDelta: (text: string) => {
            setStreamingContent((prev) => prev + text);
          },
          onThinkingDelta: (thinking: string) => {
            setStreamingThinking((prev) => prev + thinking);
          },
          onComplete: (completedMessage: StreamMessage) => {
            // 完了したメッセージをUIに反映
            setStreamMessages((prev) => [
              ...prev.filter((msg) => msg.id !== 'temp-assistant'),
              completedMessage,
            ]);
            setStreamingContent('');
            setStreamingThinking('');
            setIsStreaming(false);
          },
        };

        // メッセージを送信
        await streamChatService.sendStreamMessage(
          currentStreamChat.id,
          message,
          handlers,
        );

        setError(null);
      } catch (err) {
        console.error('ストリーミングメッセージ送信エラー:', err);
        setError('ストリーミングメッセージの送信中にエラーが発生しました。');
        setIsStreaming(false);
      }
    },
    [currentStreamChat],
  );

  // 初期化時に全てのストリーミングチャットを取得
  useEffect(() => {
    fetchStreamChats();
  }, [fetchStreamChats]);

  return {
    streamChats,
    currentStreamChat,
    streamMessages,
    isStreaming,
    streamingContent,
    streamingThinking,
    error,
    fetchStreamChats,
    fetchStreamMessages,
    createStreamChat,
    selectStreamChat,
    updateStreamChatTitle,
    deleteStreamChat,
    sendStreamMessage,
  };
}
