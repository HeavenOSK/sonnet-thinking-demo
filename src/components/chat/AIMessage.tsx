'use client';

import { useState } from 'react';
import { Message, ThinkingBlock } from '../../types';
import { ThinkingSection } from './ThinkingSection';

interface AIMessageProps {
  message: Message;
}

/**
 * AIメッセージコンポーネント
 */
export function AIMessage({ message }: AIMessageProps) {
  const [showThinking, setShowThinking] = useState(false);

  // thinking部分の抽出
  const thinkingBlocks = message.contentBlocks?.filter(
    (block): block is ThinkingBlock => block.type === 'thinking',
  );

  // thinking部分があるかどうか
  const hasThinking = thinkingBlocks && thinkingBlocks.length > 0;

  /**
   * thinking表示切り替えハンドラー
   */
  const toggleThinking = () => {
    setShowThinking(!showThinking);
  };

  return (
    <div className="flex items-start">
      {/* AIアイコン */}
      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200">
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
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      </div>

      {/* メッセージ内容 */}
      <div className="flex-1">
        <div className="mb-1 font-semibold text-gray-700 text-sm dark:text-gray-300">
          Claude
        </div>
        <div className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800 dark:text-gray-200">
          {message.content.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-2' : ''}>
              {line}
            </p>
          ))}

          {/* thinking部分があれば表示切り替えボタンを表示 */}
          {hasThinking && (
            <div className="mt-4">
              <button
                onClick={toggleThinking}
                className="flex items-center text-purple-600 text-sm hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {showThinking ? '思考プロセスを隠す' : '思考プロセスを表示'}
              </button>
            </div>
          )}
        </div>

        {/* thinking部分 */}
        {hasThinking && showThinking && (
          <ThinkingSection thinkingBlocks={thinkingBlocks} />
        )}

        <div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
          {new Date(message.timestamp).toLocaleString('ja-JP')}
        </div>
      </div>
    </div>
  );
}
