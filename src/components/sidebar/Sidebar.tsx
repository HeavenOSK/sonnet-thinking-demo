'use client';

import { useState } from 'react';
import { Chat } from '../../types';
import { ChatList } from './ChatList';
import { NewChatButton } from './NewChatButton';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  loading: boolean;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (title: string) => Promise<Chat | null>;
  onDeleteChat: (chatId: string) => Promise<void>;
  onUpdateChatTitle: (chatId: string, title: string) => Promise<void>;
}

/**
 * サイドバーコンポーネント
 * チャット一覧と新規チャット作成ボタンを含む
 */
export function Sidebar({
  chats,
  currentChatId,
  loading,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
  onUpdateChatTitle,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);

  /**
   * 新規チャット作成ハンドラー
   */
  const handleCreateChat = async () => {
    setIsCreating(true);
    try {
      // 新規チャットのデフォルトタイトル
      const defaultTitle = `新しいチャット ${new Date().toLocaleString(
        'ja-JP',
        {
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        },
      )}`;

      await onCreateChat(defaultTitle);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between border-gray-200 border-b p-4 dark:border-gray-800">
        <h1 className="font-semibold text-gray-900 text-xl dark:text-white">
          Sonnet Thinking
        </h1>
      </div>

      {/* 新規チャット作成ボタン */}
      <div className="p-4">
        <NewChatButton
          onClick={handleCreateChat}
          disabled={isCreating || loading}
        />
      </div>

      {/* チャット一覧 */}
      <div className="flex-1 overflow-y-auto p-2">
        <ChatList
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onUpdateChatTitle={onUpdateChatTitle}
          disabled={loading}
        />
      </div>
    </div>
  );
}
