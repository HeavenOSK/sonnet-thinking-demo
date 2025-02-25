'use client';

import { useEffect } from 'react';
import { initializeDatabase } from '../../lib/db-init';

interface MainLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

/**
 * メインレイアウトコンポーネント
 * サイドバーとメインコンテンツエリアを含む2カラムレイアウト
 */
export function MainLayout({ sidebar, content }: MainLayoutProps) {
  // アプリケーション起動時にIndexedDBを初期化
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.error('データベース初期化エラー:', error);
      }
    };

    init();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* サイドバー */}
      <div className="w-80 flex-shrink-0 border-gray-200 border-r bg-white dark:border-gray-800 dark:bg-gray-950">
        {sidebar}
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex flex-1 flex-col overflow-hidden">{content}</div>
    </div>
  );
}
