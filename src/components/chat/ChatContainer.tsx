'use client';

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
  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー */}
      <div className="border-gray-200 border-b bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="font-semibold text-gray-900 text-lg dark:text-white">
          {chatId ? 'チャット' : 'チャットを選択または作成してください'}
        </h2>
      </div>

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto p-4">
        {chatId ? (
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
          disabled={!chatId || loading}
          loading={loading}
        />
      </div>
    </div>
  );
}
