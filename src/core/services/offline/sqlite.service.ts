import * as sqljs from 'sql.js';
import type { UserRecord, LessonRecord, DictionaryRecord, QuizRecord, DailyLimitRecord } from './types';
import { migrationsService } from './migrations.service';
import { allMigrations } from './migrations';

export class SQLiteService {
  private db: any;
  private initialized = false;

  /**
   * Initialize SQLite database with migrations and seed data
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('SQLite already initialized');
      return;
    }

    try {
      console.log('🔄 Initializing SQLite database...');
      
      // Initialize sql.js with correct WASM path
      const SQL = await sqljs.default({
        locateFile: (file: string) => {
          console.log('📦 Loading SQL.js file:', file);
          return `/sql-wasm/${file}`;
        }
      });
      
      // Try to load existing database
      let dbData: ArrayBuffer | null = null;
      
      try {
        const response = await fetch('/assets/databases/cameroon_languages.db');
        if (response.ok) {
          dbData = await response.arrayBuffer();
          console.log('✅ Loaded existing database from assets');
        }
      } catch (e) {
        console.log('ℹ️ No existing database found, will create new one');
      }

      // Create or load database
      if (dbData) {
        this.db = new SQL.Database(new Uint8Array(dbData));
      } else {
        this.db = new SQL.Database();
        console.log('✅ Created new empty database');
      }

      // Initialize migrations service
      migrationsService.initialize(this.db);
      
      // Register all migrations
      migrationsService.registerMigrations(allMigrations);
      
      // Run pending migrations
      const migrationResult = await migrationsService.runPendingMigrations();
      console.log(`✅ Migrations complete: ${migrationResult.applied} applied, ${migrationResult.skipped} skipped`);
      
      if (migrationResult.errors.length > 0) {
        console.error('⚠️ Migration errors:', migrationResult.errors);
      }

      // Load seed data if database is new
      await this.loadSeedDataIfNeeded();

      this.initialized = true;
      console.log('✅ SQLite initialization complete');
      
      // Log migration summary
      const summary = migrationsService.getSummary();
      console.log('📊 Migration Summary:', summary);
      
    } catch (error) {
      console.error('❌ Failed to initialize SQLite:', error);
      throw error;
    }
  }

  /**
   * Load seed data if database is empty
   */
  private async loadSeedDataIfNeeded(): Promise<void> {
    try {
      // Check if database has data
      const langCount = await this.query<{ count: number }>('SELECT COUNT(*) as count FROM languages');
      
      if (langCount[0]?.count === 0) {
        console.log('🔄 Loading seed data...');
        
        // Fetch seed data JSON
        const response = await fetch('/assets/data/seed-data.json');
        if (!response.ok) {
          console.warn('⚠️ Seed data file not found, skipping seed data load');
          return;
        }
        
        const seedData = await response.json();
        
        // Insert seed data
        if (seedData.languages) {
          await this.bulkInsert('languages', seedData.languages);
          console.log(`✅ Loaded ${seedData.languages.length} languages`);
        }
        
        if (seedData.categories) {
          await this.bulkInsert('categories', seedData.categories);
          console.log(`✅ Loaded ${seedData.categories.length} categories`);
        }
        
        if (seedData.translations) {
          await this.bulkInsert('translations', seedData.translations);
          console.log(`✅ Loaded ${seedData.translations.length} translations`);
        }
        
        if (seedData.lessons) {
          await this.bulkInsert('lessons', seedData.lessons);
          console.log(`✅ Loaded ${seedData.lessons.length} lessons`);
        }
        
        if (seedData.quizzes) {
          await this.bulkInsert('quizzes', seedData.quizzes);
          console.log(`✅ Loaded ${seedData.quizzes.length} quizzes`);
        }
        
        if (seedData.achievements) {
          await this.bulkInsert('achievements', seedData.achievements);
          console.log(`✅ Loaded ${seedData.achievements.length} achievements`);
        }
        
        if (seedData.app_settings) {
          await this.bulkInsert('app_settings', seedData.app_settings);
          console.log(`✅ Loaded ${seedData.app_settings.length} app settings`);
        }
        
        console.log('✅ Seed data loaded successfully');
      } else {
        console.log('ℹ️ Database already has data, skipping seed data load');
      }
    } catch (error) {
      console.error('❌ Error loading seed data:', error);
      // Don't throw - seed data is optional
    }
  }

  /**
   * Bulk insert data into a table
   */
  private async bulkInsert(table: string, records: any[]): Promise<void> {
    if (!records || records.length === 0) return;
    
    const columns = Object.keys(records[0]);
    const placeholders = columns.map(() => '?').join(', ');
    const sql = `INSERT OR IGNORE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    for (const record of records) {
      const values = columns.map(col => record[col]);
      await this.run(sql, values);
    }
  }

  /**
   * Get database instance (for migrations and advanced operations)
   */
  getDatabase(): any {
    return this.db;
  }

  /**
   * Export database to binary
   */
  exportDatabase(): Uint8Array {
    if (!this.db) throw new Error('SQLite not initialized');
    return this.db.export();
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

  async run(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) throw new Error('SQLite not initialized');
    this.db.run(sql, params);
  }

  // Dictionary methods
  async searchDictionary(searchTerm: string, languageId?: string): Promise<DictionaryRecord[]> {
    const like = `%${searchTerm}%`;
    if (languageId) {
      return this.query<DictionaryRecord>(
        'SELECT * FROM translations WHERE language_id = ? AND (french_text LIKE ? OR translation LIKE ?) LIMIT 50',
        [languageId, like, like]
      );
    }
    return this.query<DictionaryRecord>('SELECT * FROM translations WHERE french_text LIKE ? OR translation LIKE ? LIMIT 50', [like, like]);
  }

  async getLanguages() {
    return this.query<any>('SELECT * FROM languages');
  }

  // User methods
  async getUserByFirebaseUid(firebaseUid: string): Promise<UserRecord | null> {
    const users = await this.query<UserRecord>('SELECT * FROM users WHERE firebase_uid = ?', [firebaseUid]);
    return users[0] || null;
  }

  // Lesson methods
  async getLessons(languageId?: string): Promise<LessonRecord[]> {
    if (languageId) {
      return this.query<LessonRecord>('SELECT * FROM lessons WHERE language_id = ? ORDER BY order_index', [languageId]);
    }
    return this.query<LessonRecord>('SELECT * FROM lessons ORDER BY language_id, order_index');
  }

  // Quiz methods
  async getQuizzes(languageId?: string): Promise<QuizRecord[]> {
    if (languageId) {
      return this.query<QuizRecord>('SELECT * FROM quizzes WHERE language_id = ?', [languageId]);
    }
    return this.query<QuizRecord>('SELECT * FROM quizzes');
  }

  // Daily limits methods
  async getDailyLimit(userId: number, date: string): Promise<DailyLimitRecord | null> {
    const limits = await this.query<DailyLimitRecord>(
      'SELECT * FROM daily_limits WHERE user_id = ? AND date = ?',
      [userId, date]
    );
    return limits[0] || null;
  }

  async updateDailyLimit(userId: number, date: string, type: 'lessons' | 'readings' | 'quizzes', increment: number = 1): Promise<void> {
    const existing = await this.getDailyLimit(userId, date);
    if (existing) {
      const column = type === 'lessons' ? 'lessons_used' : type === 'readings' ? 'readings_used' : 'quizzes_used';
      await this.run(`UPDATE daily_limits SET ${column} = ${column} + ? WHERE user_id = ? AND date = ?`, [increment, userId, date]);
    } else {
      const maxLessons = 5, maxReadings = 5, maxQuizzes = 5;
      await this.run(
        'INSERT INTO daily_limits (user_id, date, lessons_used, readings_used, quizzes_used, max_lessons, max_readings, max_quizzes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, date, type === 'lessons' ? increment : 0, type === 'readings' ? increment : 0, type === 'quizzes' ? increment : 0, maxLessons, maxReadings, maxQuizzes]
      );
    }
  }

  async canAccess(userId: number, date: string, type: 'lessons' | 'readings' | 'quizzes'): Promise<boolean> {
    const limit = await this.getDailyLimit(userId, date);
    if (!limit) return true; // No limit record means can access
    const used = type === 'lessons' ? limit.lessonsUsed : type === 'readings' ? limit.readingsUsed : limit.quizzesUsed;
    const max = type === 'lessons' ? limit.maxLessons : type === 'readings' ? limit.maxReadings : limit.maxQuizzes;
    return used < max;
  }

  // ====== NEW CRUD METHODS (v2.0) ======

  // User CRUD methods
  async createUser(data: {
    firebaseUid: string;
    email: string;
    displayName?: string;
    role?: string;
  }): Promise<number> {
    const { firebaseUid, email, displayName, role = 'student' } = data;
    
    await this.run(
      `INSERT INTO users (firebase_uid, email, display_name, role, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firebaseUid, email, displayName || email, role, Date.now(), Date.now()]
    );
    
    // Get the inserted user ID
    const user = await this.getUserByFirebaseUid(firebaseUid);
    return user?.user_id || 0;
  }

  async updateUser(userId: number, updates: Partial<UserRecord>): Promise<void> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      setClauses.push(`${key} = ?`);
      values.push(value);
    });
    
    if (setClauses.length > 0) {
      values.push(Date.now()); // updated_at
      values.push(userId);
      await this.run(
        `UPDATE users SET ${setClauses.join(', ')}, updated_at = ? WHERE user_id = ?`,
        values
      );
    }
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const users = await this.query<UserRecord>('SELECT * FROM users WHERE email = ?', [email]);
    return users[0] || null;
  }

  async getUserById(userId: number): Promise<UserRecord | null> {
    const users = await this.query<UserRecord>('SELECT * FROM users WHERE user_id = ?', [userId]);
    return users[0] || null;
  }

  // Translation (Dictionary) CRUD methods
  async insertTranslation(data: {
    frenchText: string;
    languageId: string;
    translation: string;
    categoryId?: string;
    pronunciation?: string;
    usageNotes?: string;
    difficultyLevel?: string;
    createdBy?: string;
  }): Promise<number> {
    const {
      frenchText,
      languageId,
      translation,
      categoryId,
      pronunciation,
      usageNotes,
      difficultyLevel = 'beginner',
      createdBy = 'system'
    } = data;

    await this.run(
      `INSERT INTO translations 
       (french_text, language_id, translation, category_id, pronunciation, usage_notes, difficulty_level, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [frenchText, languageId, translation, categoryId, pronunciation, usageNotes, difficultyLevel, createdBy]
    );

    const result = await this.query<{ translation_id: number }>(
      'SELECT translation_id FROM translations WHERE french_text = ? AND language_id = ? ORDER BY translation_id DESC LIMIT 1',
      [frenchText, languageId]
    );
    
    return result[0]?.translation_id || 0;
  }

  async updateTranslation(translationId: number, updates: Partial<DictionaryRecord>): Promise<void> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      setClauses.push(`${key} = ?`);
      values.push(value);
    });
    
    if (setClauses.length > 0) {
      values.push(Date.now());
      values.push(translationId);
      await this.run(
        `UPDATE translations SET ${setClauses.join(', ')}, updated_date = ? WHERE translation_id = ?`,
        values
      );
    }
  }

  async deleteTranslation(translationId: number): Promise<void> {
    await this.run('DELETE FROM translations WHERE translation_id = ?', [translationId]);
  }

  // Lesson CRUD methods
  async insertLesson(data: {
    languageId: string;
    title: string;
    description?: string;
    content: string;
    level: string;
    orderIndex: number;
    audioUrl?: string;
    videoUrl?: string;
    estimatedDuration?: number;
    xpReward?: number;
    createdBy?: string;
  }): Promise<number> {
    const {
      languageId,
      title,
      description,
      content,
      level,
      orderIndex,
      audioUrl,
      videoUrl,
      estimatedDuration,
      xpReward = 10,
      createdBy = 'system'
    } = data;

    await this.run(
      `INSERT INTO lessons 
       (language_id, title, description, content, level, order_index, audio_url, video_url, 
        estimated_duration, xp_reward, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [languageId, title, description, content, level, orderIndex, audioUrl, videoUrl, estimatedDuration, xpReward, createdBy]
    );

    const result = await this.query<{ lesson_id: number }>(
      'SELECT lesson_id FROM lessons WHERE title = ? AND language_id = ? ORDER BY lesson_id DESC LIMIT 1',
      [title, languageId]
    );
    
    return result[0]?.lesson_id || 0;
  }

  async updateLesson(lessonId: number, updates: Partial<LessonRecord>): Promise<void> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      setClauses.push(`${key} = ?`);
      values.push(value);
    });
    
    if (setClauses.length > 0) {
      values.push(Date.now());
      values.push(lessonId);
      await this.run(
        `UPDATE lessons SET ${setClauses.join(', ')}, updated_date = ? WHERE lesson_id = ?`,
        values
      );
    }
  }

  async deleteLesson(lessonId: number): Promise<void> {
    await this.run('DELETE FROM lessons WHERE lesson_id = ?', [lessonId]);
  }

  async getLessonById(lessonId: number): Promise<LessonRecord | null> {
    const lessons = await this.query<LessonRecord>('SELECT * FROM lessons WHERE lesson_id = ?', [lessonId]);
    return lessons[0] || null;
  }

  // Quiz CRUD methods
  async insertQuiz(data: {
    title: string;
    description?: string;
    languageId?: string;
    level?: string;
    questions: string; // JSON string
    timeLimit?: number;
    passingScore?: number;
    xpReward?: number;
    createdBy?: string;
  }): Promise<number> {
    const {
      title,
      description,
      languageId,
      level,
      questions,
      timeLimit,
      passingScore = 70,
      xpReward = 20,
      createdBy = 'system'
    } = data;

    await this.run(
      `INSERT INTO quizzes 
       (title, description, language_id, level, questions, time_limit, passing_score, xp_reward, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, languageId, level, questions, timeLimit, passingScore, xpReward, createdBy]
    );

    const result = await this.query<{ quiz_id: number }>(
      'SELECT quiz_id FROM quizzes WHERE title = ? ORDER BY quiz_id DESC LIMIT 1',
      [title]
    );
    
    return result[0]?.quiz_id || 0;
  }

  async updateQuiz(quizId: number, updates: Partial<QuizRecord>): Promise<void> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      setClauses.push(`${key} = ?`);
      values.push(value);
    });
    
    if (setClauses.length > 0) {
      values.push(Date.now());
      values.push(quizId);
      await this.run(
        `UPDATE quizzes SET ${setClauses.join(', ')}, updated_at = ? WHERE quiz_id = ?`,
        values
      );
    }
  }

  async deleteQuiz(quizId: number): Promise<void> {
    await this.run('DELETE FROM quizzes WHERE quiz_id = ?', [quizId]);
  }

  async getQuizById(quizId: number): Promise<QuizRecord | null> {
    const quizzes = await this.query<QuizRecord>('SELECT * FROM quizzes WHERE quiz_id = ?', [quizId]);
    return quizzes[0] || null;
  }

  // User Progress methods
  async recordProgress(
    userId: number,
    contentType: 'lesson' | 'quiz',
    contentId: number,
    data: {
      status?: string;
      score?: number;
      timeSpent?: number;
      attempts?: number;
    }
  ): Promise<void> {
    const { status, score, timeSpent, attempts } = data;
    const now = Date.now();

    // Check if progress record exists
    const existing = await this.query<{ progress_id: number }>(
      'SELECT progress_id FROM user_progress WHERE user_id = ? AND content_type = ? AND content_id = ?',
      [userId, contentType, contentId]
    );

    if (existing.length > 0) {
      // Update existing record
      const updates: string[] = [];
      const values: unknown[] = [];

      if (status) {
        updates.push('status = ?');
        values.push(status);
      }
      if (score !== undefined) {
        updates.push('score = ?');
        values.push(score);
      }
      if (timeSpent !== undefined) {
        updates.push('time_spent = time_spent + ?');
        values.push(timeSpent);
      }
      if (attempts !== undefined) {
        updates.push('attempts = attempts + ?');
        values.push(attempts);
      }
      updates.push('last_accessed = ?');
      values.push(now);

      if (status === 'completed') {
        updates.push('completed_at = ?');
        values.push(now);
      }

      values.push(userId, contentType, contentId);

      await this.run(
        `UPDATE user_progress SET ${updates.join(', ')} 
         WHERE user_id = ? AND content_type = ? AND content_id = ?`,
        values
      );
    } else {
      // Insert new record
      await this.run(
        `INSERT INTO user_progress 
         (user_id, content_type, content_id, status, score, time_spent, attempts, started_at, last_accessed, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          contentType,
          contentId,
          status || 'in_progress',
          score,
          timeSpent || 0,
          attempts || 1,
          now,
          now,
          status === 'completed' ? now : null
        ]
      );
    }
  }

  async getProgress(userId: number, contentType?: 'lesson' | 'quiz'): Promise<unknown[]> {
    if (contentType) {
      return this.query('SELECT * FROM user_progress WHERE user_id = ? AND content_type = ?', [userId, contentType]);
    }
    return this.query('SELECT * FROM user_progress WHERE user_id = ?', [userId]);
  }

  // Achievement methods
  async earnAchievement(userId: number, achievementCode: string): Promise<boolean> {
    // Check if achievement exists
    const achievement = await this.query<{ achievement_id: number; required_count: number }>(
      'SELECT achievement_id, required_count FROM achievements WHERE code = ? AND active = 1',
      [achievementCode]
    );

    if (achievement.length === 0) {
      console.warn(`Achievement ${achievementCode} not found or inactive`);
      return false;
    }

    const achId = achievement[0].achievement_id;
    const requiredCount = achievement[0].required_count;

    // Check if user already has this achievement
    const existing = await this.query<{ user_achievement_id: number; progress: number }>(
      'SELECT user_achievement_id, progress FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achId]
    );

    if (existing.length > 0) {
      // Update progress
      const newProgress = existing[0].progress + 1;

      if (newProgress >= requiredCount) {
        // Achievement unlocked
        await this.run(
          'UPDATE user_achievements SET progress = ?, earned_at = ? WHERE user_achievement_id = ?',
          [requiredCount, Date.now(), existing[0].user_achievement_id]
        );
        return true;
      } else {
        // Increment progress
        await this.run(
          'UPDATE user_achievements SET progress = ? WHERE user_achievement_id = ?',
          [newProgress, existing[0].user_achievement_id]
        );
        return false;
      }
    } else {
      // Create new achievement progress
      const initialProgress = requiredCount === 1 ? 1 : 1;
      await this.run(
        'INSERT INTO user_achievements (user_id, achievement_id, progress, earned_at) VALUES (?, ?, ?, ?)',
        [userId, achId, initialProgress, requiredCount === 1 ? Date.now() : null]
      );
      return requiredCount === 1;
    }
  }

  async getUserAchievements(userId: number): Promise<unknown[]> {
    return this.query(
      `SELECT a.*, ua.earned_at, ua.progress
       FROM user_achievements ua
       JOIN achievements a ON ua.achievement_id = a.achievement_id
       WHERE ua.user_id = ?
       ORDER BY ua.earned_at DESC`,
      [userId]
    );
  }

  async getAllAchievements(): Promise<unknown[]> {
    return this.query('SELECT * FROM achievements WHERE active = 1 ORDER BY category, name');
  }

  // App Settings methods
  async getSetting(key: string): Promise<string | null> {
    const result = await this.query<{ setting_value: string }>(
      'SELECT setting_value FROM app_settings WHERE setting_key = ?',
      [key]
    );
    return result[0]?.setting_value || null;
  }

  async setSetting(key: string, value: string, updatedBy?: number): Promise<void> {
    await this.run(
      `INSERT OR REPLACE INTO app_settings (setting_key, setting_value, updated_at, updated_by)
       VALUES (?, ?, ?, ?)`,
      [key, value, Date.now(), updatedBy]
    );
  }

  async getAllSettings(): Promise<Record<string, string>> {
    const results = await this.query<{ setting_key: string; setting_value: string }>(
      'SELECT setting_key, setting_value FROM app_settings'
    );
    
    const settings: Record<string, string> = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    
    return settings;
  }

  // Teacher Content methods
  async createTeacherContent(
    teacherId: number,
    contentType: 'translation' | 'lesson' | 'quiz',
    referenceId: number
  ): Promise<void> {
    await this.run(
      'INSERT INTO teacher_content (teacher_id, content_type, reference_id, status) VALUES (?, ?, ?, ?)',
      [teacherId, contentType, referenceId, 'draft']
    );
  }

  async updateTeacherContentStatus(
    contentId: number,
    status: 'draft' | 'pending_review' | 'approved' | 'rejected',
    reviewedBy?: number,
    reviewNotes?: string
  ): Promise<void> {
    await this.run(
      `UPDATE teacher_content 
       SET status = ?, reviewed_by = ?, review_notes = ?, reviewed_at = ?
       WHERE content_id = ?`,
      [status, reviewedBy, reviewNotes, Date.now(), contentId]
    );
  }

  async getTeacherContent(teacherId: number, status?: string): Promise<unknown[]> {
    if (status) {
      return this.query(
        'SELECT * FROM teacher_content WHERE teacher_id = ? AND status = ? ORDER BY created_at DESC',
        [teacherId, status]
      );
    }
    return this.query(
      'SELECT * FROM teacher_content WHERE teacher_id = ? ORDER BY created_at DESC',
      [teacherId]
    );
  }

  async getPendingContent(): Promise<unknown[]> {
    return this.query(
      'SELECT * FROM teacher_content WHERE status = ? ORDER BY created_at ASC',
      ['pending_review']
    );
  }

  // Admin Logs methods
  async logAdminAction(
    adminId: number,
    action: string,
    targetType?: string,
    targetId?: number,
    details?: string,
    ipAddress?: string
  ): Promise<void> {
    await this.run(
      `INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [adminId, action, targetType, targetId, details, ipAddress]
    );
  }

  async getAdminLogs(adminId?: number, limit: number = 100): Promise<unknown[]> {
    if (adminId) {
      return this.query(
        'SELECT * FROM admin_logs WHERE admin_id = ? ORDER BY timestamp DESC LIMIT ?',
        [adminId, limit]
      );
    }
    return this.query(
      'SELECT * FROM admin_logs ORDER BY timestamp DESC LIMIT ?',
      [limit]
    );
  }

  // Contact Messages methods
  async saveContactMessage(data: {
    userId?: number;
    name: string;
    email: string;
    subject?: string;
    category?: string;
    message: string;
    status?: string;
    priority?: string;
  }): Promise<number> {
    const timestamp = Date.now();
    await this.run(
      `INSERT INTO contact_messages (user_id, name, email, subject, category, message, status, priority, received_at, is_synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        data.userId || null,
        data.name,
        data.email,
        data.subject || '',
        data.category || 'general',
        data.message,
        data.status || 'new',
        data.priority || 'medium',
        timestamp
      ]
    );
    const insertResult = this.db.exec('SELECT last_insert_rowid() as id');
    return insertResult[0].values[0][0];
  }

  async getUnsyncedContactMessages(): Promise<unknown[]> {
    return this.query(
      'SELECT * FROM contact_messages WHERE is_synced = 0 ORDER BY received_at ASC'
    );
  }

  async markContactMessageSynced(id: number, firebaseId: string): Promise<void> {
    await this.run(
      'UPDATE contact_messages SET is_synced = 1, sync_at = ?, firebase_id = ? WHERE id = ?',
      [Date.now(), firebaseId, id]
    );
  }

  // Newsletter Subscriptions methods
  async saveNewsletterSubscription(data: {
    email: string;
    name?: string;
    source?: string;
  }): Promise<number> {
    const timestamp = Date.now();
    try {
      await this.run(
        `INSERT INTO newsletter_subscriptions (email, name, source, subscribed_at, is_synced)
         VALUES (?, ?, ?, ?, 0)`,
        [data.email, data.name || null, data.source || 'website', timestamp]
      );
      const insertResult = this.db.exec('SELECT last_insert_rowid() as id');
      return insertResult[0].values[0][0];
    } catch (error: any) {
      // Handle duplicate email
      if (error.message?.includes('UNIQUE constraint')) {
        throw new Error('EMAIL_ALREADY_SUBSCRIBED');
      }
      throw error;
    }
  }

  async getUnsyncedNewsletterSubscriptions(): Promise<unknown[]> {
    return this.query(
      'SELECT * FROM newsletter_subscriptions WHERE is_synced = 0 ORDER BY subscribed_at ASC'
    );
  }

  async markNewsletterSubscriptionSynced(id: number, firebaseId: string): Promise<void> {
    await this.run(
      'UPDATE newsletter_subscriptions SET is_synced = 1, sync_at = ?, firebase_id = ? WHERE id = ?',
      [Date.now(), firebaseId, id]
    );
  }

  // Offline Queue methods
  async queueAction(data: {
    actionType: string;
    collection: string;
    operation: string;
    data: unknown;
  }): Promise<number> {
    await this.run(
      `INSERT INTO offline_queue (action_type, collection, operation, data, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [data.actionType, data.collection, data.operation, JSON.stringify(data.data), Date.now()]
    );
    const insertResult = this.db.exec('SELECT last_insert_rowid() as id');
    return insertResult[0].values[0][0];
  }

  async getUnprocessedQueue(): Promise<unknown[]> {
    return this.query(
      'SELECT * FROM offline_queue WHERE processed = 0 AND retry_count < max_retries ORDER BY created_at ASC'
    );
  }

  async markQueueItemProcessed(id: number): Promise<void> {
    await this.run(
      'UPDATE offline_queue SET processed = 1, processed_at = ? WHERE id = ?',
      [Date.now(), id]
    );
  }

  async incrementQueueRetry(id: number, error: string): Promise<void> {
    await this.run(
      'UPDATE offline_queue SET retry_count = retry_count + 1, error = ? WHERE id = ?',
      [error, id]
    );
  }
}

export const sqliteService = new SQLiteService();


