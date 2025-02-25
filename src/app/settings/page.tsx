'use client';

import Link from 'next/link';
import { ApiKeyInput } from '../../components/settings/ApiKeyInput';

/**
 * 設定ページ
 */
export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link
          href="/"
          className="mr-4 flex items-center text-blue-600 hover:underline dark:text-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-1 h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          ホームに戻る
        </Link>
        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
          設定
        </h1>
      </div>

      <div className="space-y-6">
        <ApiKeyInput />

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
            アプリケーション情報
          </h2>
          <div className="space-y-2 text-gray-600 text-sm dark:text-gray-300">
            <p>
              <span className="font-medium">バージョン:</span> 1.0.0
            </p>
            <p>
              <span className="font-medium">使用モデル:</span>{' '}
              claude-3-7-sonnet-20250219
            </p>
            <p>
              <span className="font-medium">データ保存:</span>{' '}
              IndexedDB（ブラウザ内）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
