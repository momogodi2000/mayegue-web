import initSqlJs from 'sql.js';

export class SQLiteService {
  private db: any;

  async initialize(): Promise<void> {
    const SQL = await initSqlJs({ locateFile: (file: string) => `/sql-wasm/${file}` });
    const response = await fetch('/assets/languages.db');
    const buffer = await response.arrayBuffer();
    this.db = new SQL.Database(new Uint8Array(buffer));
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) throw new Error('SQLite not initialized');
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const rows: any[] = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows as T[];
  }

  async searchDictionary(searchTerm: string, languageId?: string) {
    const like = `%${searchTerm}%`;
    if (languageId) {
      return this.query<any>(
        'SELECT * FROM dictionary WHERE languageId = ? AND (frenchText LIKE ? OR localText LIKE ?) LIMIT 50',
        [languageId, like, like]
      );
    }
    return this.query<any>('SELECT * FROM dictionary WHERE frenchText LIKE ? OR localText LIKE ? LIMIT 50', [like, like]);
  }

  async getLanguages() {
    return this.query<any>('SELECT * FROM languages');
  }
}

export const sqliteService = new SQLiteService();


