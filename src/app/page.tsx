'use client';

import { useEffect } from 'react';
import { ChatContainer } from '../components/chat/ChatContainer';
import { MainLayout } from '../components/layout/MainLayout';
import { Sidebar } from '../components/sidebar/Sidebar';
import { useChat } from '../hooks/useChat';

export default function Home() {
  const {
    chats,
    currentChat,
    messages,
    loading,
    error,
    createChat,
    selectChat,
    updateChatTitle,
    deleteChat,
    sendMessage,
  } = useChat();

  // エラーハンドリング
  useEffect(() => {
    if (error) {
      console.error('エラー:', error);
      // エラーメッセージを表示する処理を追加
    }
  }, [error]);

  return (
    <MainLayout
      sidebar={
        <Sidebar
          chats={chats}
          currentChatId={currentChat?.id || null}
          loading={loading}
          onSelectChat={selectChat}
          onCreateChat={createChat}
          onDeleteChat={deleteChat}
          onUpdateChatTitle={updateChatTitle}
        />
      }
      content={
        <ChatContainer
          chatId={currentChat?.id || null}
          messages={messages}
          loading={loading}
          onSendMessage={sendMessage}
        />
      }
    />
  );
}
