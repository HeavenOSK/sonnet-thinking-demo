'use client';

import { StreamMessage } from '../../types/stream';

interface StreamUserMessageProps {
  message: StreamMessage;
}

/**
 * ストリーミングユーザーメッセージコンポーネント
 */
export function StreamUserMessage({ message }: StreamUserMessageProps) {
  return (
    <div className="flex items-start">
      {/* ユーザーアイコン */}
      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200">
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
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>

      {/* メッセージ内容 */}
      <div className="max-w-full flex-1 overflow-hidden">
        <div className="mb-1 font-semibold text-gray-700 text-sm dark:text-gray-300">
          あなた
        </div>
        <div className="rounded-lg bg-blue-50 p-3 shadow-sm dark:bg-blue-900/20 dark:text-gray-200">
          {message.content.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ))}
        </div>
        <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
          {new Date(message.timestamp).toLocaleString('ja-JP')}
        </div>
      </div>
    </div>
  );
}
