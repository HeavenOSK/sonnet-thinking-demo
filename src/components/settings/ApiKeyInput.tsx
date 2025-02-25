'use client';

import { useEffect, useState } from 'react';

/**
 * APIキー設定コンポーネント
 */
export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // 初期化時にローカルストレージからAPIキーを取得
  useEffect(() => {
    const savedApiKey = localStorage.getItem('anthropic-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsSaved(true);
    }
  }, []);

  /**
   * APIキーを保存
   */
  const saveApiKey = () => {
    if (!apiKey.trim()) return;

    localStorage.setItem('anthropic-api-key', apiKey);
    setIsSaved(true);
  };

  /**
   * APIキーをクリア
   */
  const clearApiKey = () => {
    localStorage.removeItem('anthropic-api-key');
    setApiKey('');
    setIsSaved(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 font-semibold text-gray-900 text-lg dark:text-white">
        Anthropic API キー設定
      </h2>
      <div className="mb-4">
        <p className="mb-2 text-gray-600 text-sm dark:text-gray-300">
          Anthropic APIを使用するには、APIキーが必要です。
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-600 hover:underline dark:text-blue-400"
          >
            Anthropicコンソール
          </a>
          からAPIキーを取得してください。
        </p>
        <div className="flex">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={saveApiKey}
            disabled={!apiKey.trim()}
            className="rounded-r-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            保存
          </button>
        </div>
      </div>
      {isSaved && (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600 dark:text-green-400">
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">APIキーが保存されています</span>
          </div>
          <button
            onClick={clearApiKey}
            className="text-red-600 text-sm hover:underline dark:text-red-400"
          >
            クリア
          </button>
        </div>
      )}
    </div>
  );
}
