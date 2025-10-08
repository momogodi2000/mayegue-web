# Unified SQLite Schema Design
**Project**: Ma'a yegue Web Application  
**Date**: October 7, 2025  
**Version**: 2.0 (Hybrid Architecture)

---

## Design Principles

1. **SQLite as Primary Storage**: All app content (dictionary, lessons, quizzes, user data, teacher content) stored locally
2. **Firebase as Realtime Layer**: Only auth state, notifications, analytics, community features
3. **Offline-First**: App works fully offline except for auth and realtime features
4. **Single Source of Truth**: No data duplication between SQLite and Firebase
5. **Migration-Ready**: Schema supports versioning and migrations

---

## Complete Schema (v2.0)

### 1. Core Reference Tables

#### 1.1 `languages`
Stores the 7 supported Cameroon languages.

```sql
CREATE TABLE IF NOT EXISTS languages (
    language_id VARCHAR(10) PRIMARY KEY,     -- ISO-like code (EWO, DUA, FEF, etc.)
    language_name VARCHAR(50) NOT NULL,      -- Full name (Ewondo, Duala, etc.)
    language_family VARCHAR(100),            -- Language family classification
    region VARCHAR(50),                      -- Geographic region in Cameroon
    speakers_count INTEGER,                  -- Approximate number of speakers
    description TEXT,                        -- Detailed description
    iso_code VARCHAR(10),                    -- Official ISO 639-3 code
    active BOOLEAN DEFAULT 1,                -- Enable/disable language
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial data: EWO, DUA, FEF, FUL, BAS, BAM, YEM
```

#### 1.2 `categories`
Content categorization (greetings, numbers, family, food, etc.).

```sql
CREATE TABLE IF NOT EXISTS categories (
    category_id VARCHAR(10) PRIMARY KEY,     -- GRT, NUM, FAM, FOD, etc.
    category_name VARCHAR(50) NOT NULL,      -- Display name
    description TEXT,                        -- Category description
    icon VARCHAR(50),                        -- Icon name (optional)
    order_index INTEGER DEFAULT 0,           -- Display order
    active BOOLEAN DEFAULT 1
);

-- 24 categories predefined
```

---

### 2. Dictionary & Content Tables

#### 2.1 `translations` (Dictionary)
Core dictionary with French-to-language translations.

```sql
CREATE TABLE IF NOT EXISTS translations (
    translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    french_text TEXT NOT NULL,               -- French word/phrase
    language_id VARCHAR(10) NOT NULL,        -- Target language
    translation TEXT NOT NULL,               -- Translated text
    category_id VARCHAR(10),                 -- Category (optional)
    pronunciation TEXT,                      -- Phonetic guide
    audio_url TEXT,                          -- Path to audio file (local or CDN)
    usage_notes TEXT,                        -- Context and usage examples
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    created_by TEXT,                         -- 'system' or user_id (for teacher additions)
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT 0,              -- Admin verification flag
    FOREIGN KEY (language_id) REFERENCES languages(language_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_id);
CREATE INDEX IF NOT EXISTS idx_translations_category ON translations(category_id);
CREATE INDEX IF NOT EXISTS idx_translations_difficulty ON translations(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_translations_french ON translations(french_text);
CREATE INDEX IF NOT EXISTS idx_translations_created_by ON translations(created_by);
```

#### 2.2 `lessons`
Structured lessons by language and level.

```sql
CREATE TABLE IF NOT EXISTS lessons (
    lesson_id INTEGER PRIMARY KEY AUTOINCREMENT,
    language_id VARCHAR(10) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,                   -- Lesson content (Markdown or JSON)
    level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
    order_index INTEGER NOT NULL,            -- Sequential order within language/level
    audio_url TEXT,                          -- Lesson audio (local or CDN)
    video_url TEXT,                          -- Optional video link
    estimated_duration INTEGER,              -- Minutes
    xp_reward INTEGER DEFAULT 10,            -- XP earned upon completion
    created_by TEXT DEFAULT 'system',        -- 'system' or teacher user_id
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT 1,             -- Draft or published
    verified BOOLEAN DEFAULT 0,              -- Admin verification
    FOREIGN KEY (language_id) REFERENCES languages(language_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lessons_language ON lessons(language_id);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_created_by ON lessons(created_by);
```

#### 2.3 `quizzes`
Quiz definitions with JSON questions.

```sql
CREATE TABLE IF NOT EXISTS quizzes (
    quiz_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    language_id VARCHAR(10),                 -- NULL = multi-language quiz
    level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')),
    questions TEXT NOT NULL,                 -- JSON array of question objects
    time_limit INTEGER,                      -- Seconds (optional)
    passing_score INTEGER DEFAULT 70,        -- Percentage required to pass
    xp_reward INTEGER DEFAULT 20,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT 1,
    verified BOOLEAN DEFAULT 0,
    FOREIGN KEY (language_id) REFERENCES languages(language_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_quizzes_language ON quizzes(language_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_level ON quizzes(level);
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON quizzes(created_by);
```

---

### 3. User Tables

#### 3.1 `users`
Local user records linked to Firebase Auth.

```sql
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    firebase_uid TEXT UNIQUE NOT NULL,       -- Link to Firebase Auth
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT CHECK(role IN ('guest', 'student', 'teacher', 'admin')) NOT NULL DEFAULT 'guest',
    
    -- Gamification
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    ngondo_coins INTEGER DEFAULT 0,          -- Virtual currency
    
    -- Subscription
    subscription TEXT CHECK(subscription IN ('free', 'premium', 'family', 'teacher', 'enterprise')) DEFAULT 'free',
    subscription_expires INTEGER,            -- Unix timestamp
    
    -- Preferences (JSON)
    preferences TEXT,                        -- JSON: { language, theme, notifications, etc. }
    
    -- Stats (JSON)
    stats TEXT,                              -- JSON: { lessonsCompleted, wordsLearned, currentStreak, etc. }
    
    -- Timestamps
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    last_login INTEGER,
    
    -- Flags
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    two_factor_enabled BOOLEAN DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
```

**Note**: Guest users have a special `firebase_uid = 'guest-local'` (not linked to Firebase).

#### 3.2 `daily_limits`
Guest quota tracking (5 lessons/readings/quizzes per day).

```sql
CREATE TABLE IF NOT EXISTS daily_limits (
    limit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,                -- Local user_id (guest = 0)
    date TEXT NOT NULL,                      -- YYYY-MM-DD
    lessons_used INTEGER DEFAULT 0,
    readings_used INTEGER DEFAULT 0,
    quizzes_used INTEGER DEFAULT 0,
    max_lessons INTEGER DEFAULT 5,
    max_readings INTEGER DEFAULT 5,
    max_quizzes INTEGER DEFAULT 5,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, date)                    -- One record per user per day
);

CREATE INDEX IF NOT EXISTS idx_daily_limits_user_date ON daily_limits(user_id, date);
```

#### 3.3 `user_progress`
**NEW**: Tracks user completion of lessons and quizzes.

```sql
CREATE TABLE IF NOT EXISTS user_progress (
    progress_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_type TEXT CHECK(content_type IN ('lesson', 'quiz')) NOT NULL,
    content_id INTEGER NOT NULL,             -- lesson_id or quiz_id
    
    -- Progress tracking
    status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    score INTEGER,                           -- Percentage (for quizzes)
    time_spent INTEGER DEFAULT 0,            -- Seconds
    attempts INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at INTEGER,
    completed_at INTEGER,
    last_accessed INTEGER,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, content_type, content_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content ON user_progress(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON user_progress(status);
```

#### 3.4 `achievements`
**NEW**: Gamification - badges, trophies, milestones.

```sql
CREATE TABLE IF NOT EXISTS achievements (
    achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,               -- Unique identifier (e.g., 'first_lesson', 'streak_7')
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,                               -- Icon reference
    category TEXT,                           -- 'progress', 'streak', 'mastery', etc.
    xp_reward INTEGER DEFAULT 0,
    coin_reward INTEGER DEFAULT 0,
    required_count INTEGER DEFAULT 1,        -- How many times to trigger
    active BOOLEAN DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    earned_at INTEGER DEFAULT (strftime('%s', 'now')),
    progress INTEGER DEFAULT 0,              -- Current progress toward achievement
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
```

---

### 4. Teacher & Admin Tables

#### 4.1 `teacher_content`
**NEW**: Track teacher-created content for approval workflow.

```sql
CREATE TABLE IF NOT EXISTS teacher_content (
    content_id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,             -- Local user_id with role='teacher'
    content_type TEXT CHECK(content_type IN ('translation', 'lesson', 'quiz')) NOT NULL,
    reference_id INTEGER,                    -- ID in translations/lessons/quizzes table
    status TEXT CHECK(status IN ('draft', 'pending_review', 'approved', 'rejected')) DEFAULT 'draft',
    reviewed_by INTEGER,                     -- Admin user_id
    review_notes TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    reviewed_at INTEGER,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_teacher_content_teacher ON teacher_content(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_content_status ON teacher_content(status);
```

#### 4.2 `admin_logs`
**NEW**: Audit trail for admin actions.

```sql
CREATE TABLE IF NOT EXISTS admin_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action TEXT NOT NULL,                    -- 'approve_content', 'delete_user', 'update_settings', etc.
    target_type TEXT,                        -- 'user', 'lesson', 'translation', etc.
    target_id INTEGER,
    details TEXT,                            -- JSON with additional info
    ip_address TEXT,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
```

---

### 5. Settings & Configuration

#### 5.1 `app_settings`
**NEW**: Application-level settings (not user-specific).

```sql
CREATE TABLE IF NOT EXISTS app_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT,                      -- JSON or plain text
    setting_type TEXT,                       -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_by INTEGER,
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Initial settings
INSERT OR IGNORE INTO app_settings (setting_key, setting_value, setting_type, description) VALUES
    ('app_version', '2.0.0', 'string', 'Current app version'),
    ('maintenance_mode', 'false', 'boolean', 'Maintenance mode flag'),
    ('guest_lesson_limit', '5', 'number', 'Daily lesson limit for guests'),
    ('guest_reading_limit', '5', 'number', 'Daily reading limit for guests'),
    ('guest_quiz_limit', '5', 'number', 'Daily quiz limit for guests');
```

---

### 6. Migration Tracking

#### 6.1 `migrations`
Tracks applied schema migrations.

```sql
CREATE TABLE IF NOT EXISTS migrations (
    migration_id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT UNIQUE NOT NULL,            -- e.g., '001_initial_schema', '002_add_achievements'
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum TEXT,                           -- MD5/SHA hash for verification
    execution_time INTEGER                   -- Milliseconds
);
```

---

## Data Relationships Diagram

```
languages (7)
    ├─> translations (dictionary)
    ├─> lessons
    └─> quizzes

categories (24)
    └─> translations (optional FK)

users
    ├─> daily_limits (guest quota)
    ├─> user_progress (lesson/quiz tracking)
    ├─> user_achievements (gamification)
    ├─> teacher_content (if role=teacher)
    └─> admin_logs (if role=admin)

achievements
    └─> user_achievements (many-to-many)

teacher_content
    ├─> translations (reference_id)
    ├─> lessons (reference_id)
    └─> quizzes (reference_id)
```

---

## Schema Versions & Migration Path

### Version 1.0 (Existing)
- languages, categories, translations, lessons, users, quizzes, daily_limits, migrations

### Version 2.0 (NEW - This Design)
**Added tables**:
- `user_progress`
- `achievements`
- `user_achievements`
- `teacher_content`
- `admin_logs`
- `app_settings`

**Modified tables**:
- `users`: Added `ngondo_coins`, `subscription_expires`, `is_active`
- `translations`: Added `verified`, `audio_url`, `created_by`, `updated_date`
- `lessons`: Added `xp_reward`, `published`, `verified`, `estimated_duration`
- `quizzes`: Added `xp_reward`, `published`, `verified`

### Migration Script (SQL)

```sql
-- Migration 002: Add new tables and columns
BEGIN TRANSACTION;

-- 1. Add new columns to existing tables
ALTER TABLE users ADD COLUMN ngondo_coins INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN subscription_expires INTEGER;
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1;
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0;
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT 0;

ALTER TABLE translations ADD COLUMN audio_url TEXT;
ALTER TABLE translations ADD COLUMN verified BOOLEAN DEFAULT 0;
ALTER TABLE translations ADD COLUMN created_by TEXT;
ALTER TABLE translations ADD COLUMN updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE lessons ADD COLUMN xp_reward INTEGER DEFAULT 10;
ALTER TABLE lessons ADD COLUMN published BOOLEAN DEFAULT 1;
ALTER TABLE lessons ADD COLUMN verified BOOLEAN DEFAULT 0;
ALTER TABLE lessons ADD COLUMN estimated_duration INTEGER;
ALTER TABLE lessons ADD COLUMN created_by TEXT DEFAULT 'system';
ALTER TABLE lessons ADD COLUMN updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE quizzes ADD COLUMN xp_reward INTEGER DEFAULT 20;
ALTER TABLE quizzes ADD COLUMN published BOOLEAN DEFAULT 1;
ALTER TABLE quizzes ADD COLUMN verified BOOLEAN DEFAULT 0;
ALTER TABLE quizzes ADD COLUMN created_by TEXT DEFAULT 'system';
ALTER TABLE quizzes ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 2. Create new tables (see full CREATE TABLE statements above)
-- user_progress, achievements, user_achievements, teacher_content, admin_logs, app_settings

-- 3. Record migration
INSERT INTO migrations (version, description, checksum) VALUES
    ('002_add_gamification_and_teacher_features', 'Add user progress, achievements, teacher content, admin logs', 'checksum_v2');

COMMIT;
```

---

## Indexes Summary

**Total Indexes**: 25+

**Critical for Performance**:
- `translations.french_text` (search)
- `translations.language_id` (filtering)
- `users.firebase_uid` (auth linking)
- `daily_limits(user_id, date)` (quota checks)
- `user_progress(user_id)` (dashboard queries)

---

## Storage Estimates

| **Table** | **Rows (Initial)** | **Rows (1 Year)** | **Approx Size** |
|-----------|--------------------|-------------------|-----------------|
| languages | 7 | 10 | <1 KB |
| categories | 24 | 30 | <1 KB |
| translations | 300 | 2,000 | 200 KB |
| lessons | 50 | 500 | 500 KB |
| quizzes | 20 | 200 | 100 KB |
| users | 10 | 10,000 | 1 MB |
| daily_limits | 10 | 3,650 | 100 KB |
| user_progress | 100 | 100,000 | 5 MB |
| achievements | 50 | 100 | 10 KB |
| user_achievements | 100 | 100,000 | 2 MB |
| teacher_content | 0 | 500 | 50 KB |
| admin_logs | 0 | 5,000 | 200 KB |
| **TOTAL** | **~700** | **~220,000** | **~9 MB** |

**Note**: sql.js stores DB in memory and can persist to IndexedDB. 10MB is acceptable for web app.

---

## Role-Based Access Rules

### Guest
- **Read**: translations (dictionary), lessons (5/day), quizzes (5/day)
- **Write**: None
- **Quota**: Enforced via `daily_limits` table

### Student
- **Read**: All translations, lessons, quizzes
- **Write**: user_progress, user_achievements (own records only)
- **Quota**: None (unlimited after auth)

### Teacher
- **Read**: All content
- **Write**: 
  - Create: translations, lessons, quizzes (status='draft')
  - Update: Own content only
  - Insert: teacher_content records
- **Restrictions**: Cannot approve own content

### Admin
- **Read**: Everything
- **Write**: Everything
- **Special**: 
  - Approve/reject teacher_content
  - Manage users (activate/deactivate)
  - Run migrations
  - View admin_logs

**Enforcement**: In application layer (TypeScript services), NOT database constraints (SQLite doesn't support row-level security).

---

## JSON Structure Examples

### 1. `users.preferences` (JSON)
```json
{
  "language": "fr",
  "targetLanguages": ["EWO", "DUA"],
  "theme": "light",
  "notificationsEnabled": true,
  "dailyGoalMinutes": 30,
  "autoPlayAudio": true
}
```

### 2. `users.stats` (JSON)
```json
{
  "lessonsCompleted": 15,
  "wordsLearned": 120,
  "totalTimeMinutes": 450,
  "currentStreak": 7,
  "longestStreak": 14,
  "badgesEarned": 5,
  "lastActive": "2025-10-07"
}
```

### 3. `quizzes.questions` (JSON)
```json
[
  {
    "id": "q1",
    "type": "multiple-choice",
    "question": "Comment dit-on 'Bonjour' en Ewondo?",
    "options": ["Mbolo", "Mwa boma", "Kweni", "Jam waali"],
    "correctAnswer": "Mbolo",
    "explanation": "Mbolo est la salutation de base en Ewondo.",
    "points": 10
  },
  {
    "id": "q2",
    "type": "text-input",
    "question": "Traduisez 'Merci' en Ewondo",
    "correctAnswer": "Akiba",
    "acceptedAnswers": ["Akiba", "akiba"],
    "points": 15
  }
]
```

### 4. `admin_logs.details` (JSON)
```json
{
  "action": "approve_content",
  "content_type": "lesson",
  "lesson_id": 42,
  "teacher_id": 15,
  "previous_status": "pending_review",
  "new_status": "approved",
  "notes": "Excellent quality, approved immediately"
}
```

---

## Next Steps

1. ✅ Schema design complete
2. **Next**: Update Python script (`create_cameroon_db.py`) with:
   - New tables
   - New columns
   - Migration 002
   - Seed data for achievements
3. **Then**: Extract seed data to JSON for TS consumption

---

**References**:
- Existing schema: `docs/database-scripts/create_cameroon_db.py`
- User types: `src/shared/types/user.types.ts`
- SQLite service: `src/core/services/offline/sqlite.service.ts`
