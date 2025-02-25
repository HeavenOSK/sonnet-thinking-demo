'use client';

import { useState } from 'react';
import { ContentBlock } from '../../types';

interface JsonResponseViewerProps {
  contentBlocks: ContentBlock[];
}

/**
 * JSON レスポンス表示コンポーネント
 */
export function JsonResponseViewer({ contentBlocks }: JsonResponseViewerProps) {
  const [expanded, setExpanded] = useState(false);

  if (!contentBlocks || contentBlocks.length === 0) {
    return null;
  }

  /**
   * JSON をコピーするハンドラー
   */
  const handleCopy = () => {
    const jsonString = JSON.stringify(contentBlocks, null, 2);
    navigator.clipboard.writeText(jsonString);
    // コピー成功のフィードバックを表示する場合はここに追加
  };

  /**
   * 展開/折りたたみを切り替えるハンドラー
   */
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // JSON を整形して表示
  const formattedJson = JSON.stringify(contentBlocks, null, 2);

  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/10">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center font-medium text-blue-700 text-sm dark:text-blue-300">
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
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
            />
          </svg>
          JSON レスポンス
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleExpanded}
            className="flex items-center text-blue-600 text-xs hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {expanded ? '折りたたむ' : '展開する'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center text-blue-600 text-xs hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
              />
            </svg>
            コピー
          </button>
        </div>
      </div>
      <div
        className={`overflow-auto rounded bg-gray-100 p-2 font-mono text-gray-800 text-xs dark:bg-gray-900 dark:text-gray-200 ${
          expanded ? 'max-h-96' : 'max-h-32'
        }`}
      >
        <pre>{formattedJson}</pre>
      </div>
    </div>
  );
}
