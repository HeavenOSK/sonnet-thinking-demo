'use client';

import { useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { StreamChatContainer } from '../../components/stream-chat/StreamChatContainer';
import { useStreamChat } from '../../hooks/useStreamChat';

export default function StreamPage() {
  const {
    streamChats,
    currentStreamChat,
    streamMessages,
    isStreaming,
    streamingContent,
    streamingThinking,
    error,
    createStreamChat,
    selectStreamChat,
    updateStreamChatTitle,
    deleteStreamChat,
    sendStreamMessage,
  } = useStreamChat();

  // エラーハンドリング
  useEffect(() => {
    if (error) {
      console.error('ストリーミングエラー:', error);
      // エラーメッセージを表示する処理を追加
    }
  }, [error]);

  return (
    <MainLayout
      sidebar={
        <Sidebar
          chats={streamChats}
          currentChatId={currentStreamChat?.id || null}
          loading={isStreaming}
          onSelectChat={selectStreamChat}
          onCreateChat={createStreamChat}
          onDeleteChat={deleteStreamChat}
          onUpdateChatTitle={updateStreamChatTitle}
          isStreamMode={true}
        />
      }
      content={
        <StreamChatContainer
          chatId={currentStreamChat?.id || null}
          messages={streamMessages}
          streamingContent={streamingContent}
          streamingThinking={streamingThinking}
          isStreaming={isStreaming}
          onSendMessage={sendStreamMessage}
        />
      }
    />
  );
}
