import { getDB } from '../services/db';

/**
 * IndexedDBを初期化する
 * アプリケーションの起動時に呼び出す
 */
export async function initializeDatabase(): Promise<void> {
  try {
    // データベースへの接続を取得（この時点でデータベースが存在しなければ作成される）
    await getDB();
    console.log('IndexedDBの初期化が完了しました。');
  } catch (error) {
    console.error('IndexedDBの初期化中にエラーが発生しました:', error);
    throw new Error('データベースの初期化に失敗しました。');
  }
}
