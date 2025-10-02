import Dexie, { Table } from 'dexie';

interface UserCache { id: string; email: string; displayName: string; updatedAt: number }
interface DictionaryEntry { id: string; languageId: string; category?: string; frenchText: string; localText?: string; updatedAt: number }
interface LessonCache { id: string; languageId: string; cachedAt: number }
interface ProgressCache { id: string; userId: string; lessonId: string; progress: number; syncStatus: 'pending' | 'synced' }

class MayegueDB extends Dexie {
  users!: Table<UserCache>;
  dictionary!: Table<DictionaryEntry>;
  lessons!: Table<LessonCache>;
  progress!: Table<ProgressCache>;

  constructor() {
    super('MayegueDB');
    this.version(1).stores({
      users: 'id, email',
      dictionary: 'id, languageId, category, frenchText',
      lessons: 'id, languageId, cachedAt',
      progress: 'id, userId, lessonId, syncStatus'
    });
  }
}

export const indexedDb = new MayegueDB();


