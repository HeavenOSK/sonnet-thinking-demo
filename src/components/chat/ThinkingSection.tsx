'use client';

import { ThinkingBlock } from '../../types';

interface ThinkingSectionProps {
  thinkingBlocks: ThinkingBlock[];
}

/**
 * 思考プロセス表示セクションコンポーネント
 */
export function ThinkingSection({ thinkingBlocks }: ThinkingSectionProps) {
  if (!thinkingBlocks || thinkingBlocks.length === 0) {
    return null;
  }

  // 全てのthinkingブロックの内容を結合
  const thinkingContent = thinkingBlocks
    .map((block) => block.thinking)
    .join('\n\n');

  return (
    <div className="mt-3 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-900 dark:bg-purple-900/10">
      <div className="mb-2 flex items-center font-medium text-purple-700 text-sm dark:text-purple-300">
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
            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
          />
        </svg>
        思考プロセス
      </div>
      <div className="whitespace-pre-wrap text-purple-800 text-sm dark:text-purple-200">
        {thinkingContent.split('\n').map((line, index) => (
          <p key={index} className={index > 0 ? 'mt-2' : ''}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
