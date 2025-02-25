'use client';

import { useEffect, useRef, useState } from 'react';
import { Chat } from '../../types';
import { CheckIcon, EditIcon, TrashIcon } from './icons';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onDelete: () => Promise<void>;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onUpdateTitle: (newTitle: string) => Promise<void>;
  disabled?: boolean;
}

/**
 * チャット項目コンポーネント
 */
export function ChatItem({
  chat,
  isActive,
  isEditing,
  onSelect,
  onDelete,
  onStartEditing,
  onStopEditing,
  onUpdateTitle,
  disabled = false,
}: ChatItemProps) {
  const [title, setTitle] = useState(chat.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 編集モードになったらinputにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /**
   * タイトル更新ハンドラー
   */
  const handleUpdateTitle = async () => {
    if (title.trim() === '') {
      setTitle(chat.title);
      onStopEditing();
      return;
    }

    if (title !== chat.title) {
      await onUpdateTitle(title);
    } else {
      onStopEditing();
    }
  };

  /**
   * キー入力ハンドラー
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateTitle();
    } else if (e.key === 'Escape') {
      setTitle(chat.title);
      onStopEditing();
    }
  };

  /**
   * 削除ハンドラー
   */
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * 編集開始ハンドラー
   */
  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onStartEditing();
  };

  // 日付フォーマット
  const formattedDate = new Date(chat.updatedAt).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex-1 overflow-hidden">
        {isEditing ? (
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleUpdateTitle}
              className="w-full rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              disabled={disabled}
            />
            <button
              onClick={handleUpdateTitle}
              className="ml-2 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              disabled={disabled}
            >
              <CheckIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="truncate font-medium">{chat.title}</div>
            <div className="text-gray-500 text-xs dark:text-gray-400">
              {formattedDate}
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex opacity-0 group-hover:opacity-100">
          <button
            onClick={handleStartEditing}
            className="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            disabled={disabled}
          >
            <EditIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="ml-1 rounded p-1 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            disabled={disabled || isDeleting}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
