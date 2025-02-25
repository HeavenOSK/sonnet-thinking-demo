'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Message } from '../../types';
import { InputArea } from './InputArea';
import { MessageList } from './MessageList';

interface ChatContainerProps {
  chatId: string | null;
  messages: Message[];
  loading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

/**
 * チャットコンテナコンポーネント
 * メッセージリストと入力エリアを含む
 */
export function ChatContainer({
  chatId,
  messages,
  loading,
  onSendMessage,
}: ChatContainerProps) {
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // APIキーの存在確認
  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('anthropic-api-key');
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
    window.addEventListener('storage', checkApiKey);
    return () => window.removeEventListener('storage', checkApiKey);
  }, []);
  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー */}
      <div className="border-gray-200 border-b bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="font-semibold text-gray-900 text-lg dark:text-white">
          {chatId ? 'チャット' : 'チャットを選択または作成してください'}
        </h2>
      </div>

      {/* メッセージリスト */}
      <div className="max-w-full flex-1 overflow-y-auto p-4">
        {!hasApiKey ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center dark:border-yellow-900 dark:bg-yellow-900/10">
              <div className="mb-4 flex justify-center text-yellow-600 dark:text-yellow-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold text-lg text-yellow-800 dark:text-yellow-300">
                APIキーが設定されていません
              </h3>
              <p className="mb-4 text-yellow-700 dark:text-yellow-200">
                Anthropic APIを使用するには、APIキーの設定が必要です。
              </p>
              <Link
                href="/settings"
                className="inline-block rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-600"
              >
                APIキーを設定する
              </Link>
            </div>
          </div>
        ) : chatId ? (
          <MessageList messages={messages} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="mb-2 text-xl">👋 ようこそ</p>
              <p>
                サイドバーからチャットを選択するか、新しいチャットを作成してください。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 入力エリア */}
      <div className="border-gray-200 border-t bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <InputArea
          onSendMessage={onSendMessage}
          disabled={!chatId || loading || !hasApiKey}
          loading={loading}
        />
      </div>
    </div>
  );
}
