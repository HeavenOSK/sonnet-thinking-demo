'use client';

import { PlusIcon } from './icons';

interface NewChatButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * 新規チャット作成ボタンコンポーネント
 */
export function NewChatButton({
  onClick,
  disabled = false,
}: NewChatButtonProps) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      <PlusIcon className="h-5 w-5" />
      <span>新規チャット</span>
    </button>
  );
}
