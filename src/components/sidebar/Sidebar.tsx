'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Chat } from '../../types';
import { StreamChat } from '../../types/stream';
import { ChatList } from './ChatList';
import { NewChatButton } from './NewChatButton';
import { SettingsIcon } from './icons';

interface SidebarProps {
  chats: Chat[] | StreamChat[];
  currentChatId: string | null;
  loading: boolean;
  onSelectChat: (chatId: string) => void;
  onCreateChat: (title: string) => Promise<Chat | null | StreamChat | null>;
  onDeleteChat: (chatId: string) => Promise<void>;
  onUpdateChatTitle: (chatId: string, title: string) => Promise<void>;
  isStreamMode?: boolean;
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
  isStreamMode = false,
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

      {/* モード切り替えリンク */}
      <div className="border-gray-200 border-t px-4 pt-4 dark:border-gray-800">
        <div className="flex justify-between space-x-2">
          <Link
            href="/"
            className={`flex-1 rounded-lg px-3 py-2 text-center text-sm ${
              !isStreamMode
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            通常モード
          </Link>
          <Link
            href="/stream"
            className={`flex-1 rounded-lg px-3 py-2 text-center text-sm ${
              isStreamMode
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            ストリームモード
          </Link>
        </div>
      </div>

      {/* フッター（設定リンク） */}
      <div className="p-4">
        <Link
          href="/settings"
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <SettingsIcon className="mr-2 h-5 w-5" />
          <span>設定</span>
        </Link>
      </div>
    </div>
  );
}
