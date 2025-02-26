'use client';

import { FormEvent, useRef, useState } from 'react';

interface StreamInputAreaProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  isStreaming?: boolean;
}

/**
 * ストリーミング入力エリアコンポーネント
 */
export function StreamInputArea({
  onSendMessage,
  disabled = false,
  isStreaming = false,
}: StreamInputAreaProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * メッセージ送信ハンドラー
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled) {
      return;
    }

    try {
      await onSendMessage(message);
      setMessage('');
      // テキストエリアの高さをリセット
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('メッセージ送信エラー:', error);
    }
  };

  /**
   * テキストエリアの高さを自動調整
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setMessage(textarea.value);

    // 高さを自動調整
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  /**
   * Enterキーでメッセージを送信（Shift+Enterで改行）
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? isStreaming
                ? 'AIが応答中です...'
                : 'チャットを選択または作成してください'
              : 'メッセージを入力...'
          }
          disabled={disabled}
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-900"
          rows={1}
          style={{ minHeight: '44px', maxHeight: '200px' }}
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="absolute right-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
      <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
        {isStreaming ? (
          <span className="flex items-center justify-end">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
            ストリーミング中...
          </span>
        ) : (
          <span>Shift + Enter で改行</span>
        )}
      </div>
    </form>
  );
}
