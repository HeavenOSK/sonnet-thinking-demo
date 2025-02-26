'use client';

import { StreamMessage } from '../../types/stream';
import { StreamAIMessage } from './StreamAIMessage';
import { StreamUserMessage } from './StreamUserMessage';

interface StreamMessageListProps {
  messages: StreamMessage[];
  streamingContent: string;
  streamingThinking: string;
  isStreaming: boolean;
}

/**
 * ストリーミングメッセージリストコンポーネント
 */
export function StreamMessageList({
  messages,
  streamingContent,
  streamingThinking,
  isStreaming,
}: StreamMessageListProps) {
  // メッセージが空の場合
  if (messages.length === 0 && !isStreaming) {
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
    <div className="max-w-full space-y-6">
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === 'user' ? (
            <StreamUserMessage message={message} />
          ) : (
            <StreamAIMessage
              message={message}
              isLastMessage={message.id === messages[messages.length - 1]?.id && messages[messages.length - 1]?.role === 'assistant'}
            />
          )}
        </div>
      ))}

      {/* ストリーミング中のAIメッセージ */}
      {isStreaming && streamingContent && (
        <div>
          <StreamAIMessage
            isStreaming={true}
            streamingContent={streamingContent}
            streamingThinking={streamingThinking}
          />
        </div>
      )}
    </div>
  );
}
