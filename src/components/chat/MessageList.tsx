'use client';

import { Message } from '../../types';
import { AIMessage } from './AIMessage';
import { UserMessage } from './UserMessage';

interface MessageListProps {
  messages: Message[];
}

/**
 * メッセージリストコンポーネント
 */
export function MessageList({ messages }: MessageListProps) {
  // メッセージが空の場合
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>メッセージはまだありません。</p>
          <p>最初のメッセージを送信してみましょう。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? (
            <UserMessage message={message} />
          ) : (
            <AIMessage message={message} />
          )}
        </div>
      ))}
    </div>
  );
}
