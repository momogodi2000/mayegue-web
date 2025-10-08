/**
 * Database Migration Definitions
 * All schema migrations for the application
 */

import type { Migration } from './migrations.service';

/**
 * Migration 002: Add new tables and columns for v2.0
 * - Adds user_progress, achievements, user_achievements, teacher_content, admin_logs, app_settings tables
 * - Adds new columns to existing tables
 */
export const migration_002: Migration = {
  version: '002_add_gamification_and_teacher_features',
  description: 'Add user progress, achievements, teacher content, admin logs, and app settings',
  checksum: 'v2.0',
  
  up: (db: any) => {
    // Add new columns to users table
    try {
      db.run('ALTER TABLE users ADD COLUMN ngondo_coins INTEGER DEFAULT 0');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE users ADD COLUMN subscription_expires INTEGER');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT 0');
    } catch (e) {
      // Column might already exist
    }

    // Add new columns to translations table
    try {
      db.run('ALTER TABLE translations ADD COLUMN audio_url TEXT');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE translations ADD COLUMN verified BOOLEAN DEFAULT 0');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE translations ADD COLUMN created_by TEXT');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE translations ADD COLUMN updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    } catch (e) {
      // Column might already exist
    }

    // Add new columns to lessons table
    try {
      db.run('ALTER TABLE lessons ADD COLUMN xp_reward INTEGER DEFAULT 10');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE lessons ADD COLUMN published BOOLEAN DEFAULT 1');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE lessons ADD COLUMN verified BOOLEAN DEFAULT 0');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE lessons ADD COLUMN estimated_duration INTEGER');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE lessons ADD COLUMN created_by TEXT DEFAULT "system"');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE lessons ADD COLUMN updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    } catch (e) {
      // Column might already exist
    }

    // Add new columns to quizzes table
    try {
      db.run('ALTER TABLE quizzes ADD COLUMN xp_reward INTEGER DEFAULT 20');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE quizzes ADD COLUMN published BOOLEAN DEFAULT 1');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE quizzes ADD COLUMN verified BOOLEAN DEFAULT 0');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE quizzes ADD COLUMN created_by TEXT DEFAULT "system"');
    } catch (e) {
      // Column might already exist
    }
    
    try {
      db.run('ALTER TABLE quizzes ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
    } catch (e) {
      // Column might already exist
    }

    // Create user_progress table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_progress (
        progress_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content_type TEXT CHECK(content_type IN ('lesson', 'quiz')) NOT NULL,
        content_id INTEGER NOT NULL,
        status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
        score INTEGER,
        time_spent INTEGER DEFAULT 0,
        attempts INTEGER DEFAULT 0,
        started_at INTEGER,
        completed_at INTEGER,
        last_accessed INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE(user_id, content_type, content_id)
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_type, content_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status)');

    // Create achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS achievements (
        achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        category TEXT,
        xp_reward INTEGER DEFAULT 0,
        coin_reward INTEGER DEFAULT 0,
        required_count INTEGER DEFAULT 1,
        active BOOLEAN DEFAULT 1
      )
    `);

    // Create user_achievements table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        user_achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_id INTEGER NOT NULL,
        earned_at INTEGER DEFAULT (strftime('%s', 'now')),
        progress INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
        UNIQUE(user_id, achievement_id)
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id)');

    // Create teacher_content table
    db.run(`
      CREATE TABLE IF NOT EXISTS teacher_content (
        content_id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER NOT NULL,
        content_type TEXT CHECK(content_type IN ('translation', 'lesson', 'quiz')) NOT NULL,
        reference_id INTEGER,
        status TEXT CHECK(status IN ('draft', 'pending_review', 'approved', 'rejected')) DEFAULT 'draft',
        reviewed_by INTEGER,
        review_notes TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        reviewed_at INTEGER,
        FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_teacher_content_teacher ON teacher_content(teacher_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_teacher_content_status ON teacher_content(status)');

    // Create admin_logs table
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT,
        target_id INTEGER,
        details TEXT,
        ip_address TEXT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id)');
    db.run('CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp)');
    db.run('CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action)');

    // Create app_settings table
    db.run(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT,
        setting_type TEXT,
        description TEXT,
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_by INTEGER,
        FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Migration 002 completed successfully');
  },
  
  down: (db: any) => {
    // Rollback: Drop new tables (WARNING: This will delete all data in these tables)
    db.run('DROP TABLE IF EXISTS app_settings');
    db.run('DROP TABLE IF EXISTS admin_logs');
    db.run('DROP TABLE IF EXISTS teacher_content');
    db.run('DROP TABLE IF EXISTS user_achievements');
    db.run('DROP TABLE IF EXISTS achievements');
    db.run('DROP TABLE IF EXISTS user_progress');
    
    // Note: Cannot easily remove columns from SQLite without recreating tables
    // For production, implement a more sophisticated rollback strategy
    console.log('⚠️ Migration 002 rolled back (new tables dropped, columns remain)');
  }
};

/**
 * Migration 003: Add contact messages and newsletter subscriptions
 * - Adds contact_messages table for offline-first contact form
 * - Adds newsletter_subscriptions table for offline-first newsletter
 * - Adds offline_queue table for general sync queue
 * - Adds analytics_events table for offline analytics
 */
export const migration_003: Migration = {
  version: '003_add_contact_newsletter_offline',
  description: 'Add contact messages, newsletter subscriptions, and offline sync tables',
  checksum: 'v2.1',
  
  up: (db: any) => {
    // Create contact_messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        category TEXT DEFAULT 'general',
        message TEXT NOT NULL,
        status TEXT DEFAULT 'new',
        priority TEXT DEFAULT 'medium',
        received_at INTEGER NOT NULL,
        is_synced INTEGER DEFAULT 0,
        sync_at INTEGER,
        firebase_id TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_contact_messages_synced ON contact_messages(is_synced)');
    db.run('CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status)');
    db.run('CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email)');

    // Create newsletter_subscriptions table
    db.run(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        source TEXT DEFAULT 'website',
        subscribed_at INTEGER NOT NULL,
        verified INTEGER DEFAULT 0,
        verification_token TEXT,
        unsubscribed INTEGER DEFAULT 0,
        unsubscribed_at INTEGER,
        is_synced INTEGER DEFAULT 0,
        sync_at INTEGER,
        firebase_id TEXT
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email)');
    db.run('CREATE INDEX IF NOT EXISTS idx_newsletter_synced ON newsletter_subscriptions(is_synced)');

    // Create offline_queue table for general sync operations
    db.run(`
      CREATE TABLE IF NOT EXISTS offline_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action_type TEXT NOT NULL,
        collection TEXT NOT NULL,
        operation TEXT NOT NULL,
        data TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        max_retries INTEGER DEFAULT 3,
        error TEXT,
        created_at INTEGER NOT NULL,
        processed INTEGER DEFAULT 0,
        processed_at INTEGER
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_queue_processed ON offline_queue(processed)');
    db.run('CREATE INDEX IF NOT EXISTS idx_queue_action ON offline_queue(action_type)');

    // Create analytics_events table
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        event_type TEXT NOT NULL,
        event_name TEXT NOT NULL,
        payload TEXT,
        session_id TEXT,
        created_at INTEGER NOT NULL,
        is_synced INTEGER DEFAULT 0,
        sync_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
      )
    `);

    db.run('CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type)');
    db.run('CREATE INDEX IF NOT EXISTS idx_analytics_events_synced ON analytics_events(is_synced)');
    db.run('CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id)');

    console.log('✅ Migration 003 completed successfully');
  },
  
  down: (db: any) => {
    db.run('DROP TABLE IF EXISTS analytics_events');
    db.run('DROP TABLE IF EXISTS offline_queue');
    db.run('DROP TABLE IF EXISTS newsletter_subscriptions');
    db.run('DROP TABLE IF EXISTS contact_messages');
    console.log('⚠️ Migration 003 rolled back');
  }
};

/**
 * All migrations in order
 */
export const allMigrations: Migration[] = [
  migration_002,
  migration_003,
  // Add future migrations here
];

