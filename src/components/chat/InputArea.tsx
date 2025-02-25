'use client';

import { useEffect, useRef, useState } from 'react';
import { SendIcon } from '../sidebar/icons';

interface InputAreaProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * 入力エリアコンポーネント
 */
export function InputArea({
  onSendMessage,
  disabled = false,
  loading = false,
}: InputAreaProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  /**
   * メッセージ送信ハンドラー
   */
  const handleSendMessage = async () => {
    if (disabled || loading || !message.trim()) return;

    try {
      const trimmedMessage = message.trim();
      setMessage('');
      await onSendMessage(trimmedMessage);
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    }
  };

  /**
   * キー入力ハンドラー
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enterでメッセージ送信
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled
            ? 'チャットを選択または作成してください'
            : loading
              ? '応答を待っています...'
              : 'メッセージを入力してください...'
        }
        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        rows={1}
        disabled={disabled || loading}
      />
      <button
        onClick={handleSendMessage}
        disabled={disabled || loading || !message.trim()}
        className="-translate-y-1/2 absolute top-1/2 right-3 rounded-full p-1 text-blue-600 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
      >
        <SendIcon className="h-5 w-5" />
      </button>
      <div className="mt-2 text-gray-500 text-xs dark:text-gray-400">
        Ctrl + Enter で送信
      </div>
    </div>
  );
}
