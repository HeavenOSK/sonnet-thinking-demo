'use client';

import { useState } from 'react';
import { Chat } from '../../types';
import { ChatItem } from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onUpdateChatTitle: (chatId: string, title: string) => Promise<void>;
  disabled?: boolean;
}

/**
 * チャット一覧コンポーネント
 */
export function ChatList({
  chats,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onUpdateChatTitle,
  disabled = false,
}: ChatListProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);

  /**
   * 編集モード開始ハンドラー
   */
  const handleStartEditing = (chatId: string) => {
    setEditingChatId(chatId);
  };

  /**
   * 編集モード終了ハンドラー
   */
  const handleStopEditing = () => {
    setEditingChatId(null);
  };

  /**
   * チャットタイトル更新ハンドラー
   */
  const handleUpdateTitle = async (chatId: string, newTitle: string) => {
    await onUpdateChatTitle(chatId, newTitle);
    handleStopEditing();
  };

  // チャットを日付の新しい順にソート
  const sortedChats = [...chats].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return (
    <div className="space-y-2">
      {sortedChats.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          チャットがありません
        </div>
      ) : (
        sortedChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === currentChatId}
            isEditing={chat.id === editingChatId}
            onSelect={() => onSelectChat(chat.id)}
            onDelete={() => onDeleteChat(chat.id)}
            onStartEditing={() => handleStartEditing(chat.id)}
            onStopEditing={handleStopEditing}
            onUpdateTitle={(newTitle) => handleUpdateTitle(chat.id, newTitle)}
            disabled={disabled}
          />
        ))
      )}
    </div>
  );
}
