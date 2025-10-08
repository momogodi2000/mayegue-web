# Ma'a yegue - Hybrid SQLite Database Schema

## Overview
This document defines the unified database schema for the Ma'a yegue hybrid architecture. All application data is stored locally in SQLite, with Firebase used only for authentication, real-time notifications, and analytics.

## Core Principles
- **Local-First**: All persistent data stored in SQLite
- **Firebase Integration**: Auth, notifications, analytics only
- **Role-Based Access**: Guest, Student, Teacher, Admin roles
- **Migration Support**: Version-controlled schema evolution
- **Performance**: Optimized indexes for common queries

---

## 1. Core Tables

### 1.1 Languages
Stores supported Cameroonian languages (7 languages).

```sql
CREATE TABLE languages (
    language_id VARCHAR(10) PRIMARY KEY,      -- e.g., 'ewondo', 'bulu', 'duala'
    language_name VARCHAR(50) NOT NULL,       -- Display name
    language_family VARCHAR(100),             -- Language family
    region VARCHAR(50),                       -- Geographic region
    speakers_count INTEGER,                   -- Number of speakers
    description TEXT,                         -- Language description
    iso_code VARCHAR(10)                      -- ISO language code
);
```

### 1.2 Categories
Content categorization for dictionary entries.

```sql
CREATE TABLE categories (
    category_id VARCHAR(10) PRIMARY KEY,      -- e.g., 'greet', 'food', 'family'
    category_name VARCHAR(50) NOT NULL,       -- Display name
    description TEXT                          -- Category description
);
```

### 1.3 Translations (Dictionary)
Core dictionary with French-to-local language translations.

```sql
CREATE TABLE translations (
    translation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    french_text TEXT NOT NULL,               -- French source text
    language_id VARCHAR(10),                 -- Target language
    translation TEXT NOT NULL,               -- Local language translation
    category_id VARCHAR(10),                 -- Content category
    pronunciation TEXT,                      -- Phonetic pronunciation
    usage_notes TEXT,                        -- Usage context/notes
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    audio_url TEXT,                          -- Audio file URL (v2.0)
    verified BOOLEAN DEFAULT 0,              -- Admin verified flag (v2.0)
    created_by TEXT,                         -- Creator ID (v2.0)
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(language_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

### 1.4 Lessons
Learning content and exercises.

```sql
CREATE TABLE lessons (
    lesson_id INTEGER PRIMARY KEY AUTOINCREMENT,
    language_id VARCHAR(10) NOT NULL,        -- Target language
    title TEXT NOT NULL,                     -- Lesson title
    description TEXT,                        -- Lesson description
    content TEXT NOT NULL,                   -- Lesson content (JSON or text)
    level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
    order_index INTEGER,                     -- Display order (v2.0)
    audio_url TEXT,                          -- Audio content URL (v2.0)
    video_url TEXT,                          -- Video content URL (v2.0)
    estimated_duration INTEGER,              -- Duration in minutes (v2.0)
    xp_reward INTEGER DEFAULT 10,            -- XP earned (v2.0)
    published BOOLEAN DEFAULT 1,             -- Published flag (v2.0)
    verified BOOLEAN DEFAULT 0,              -- Admin verified (v2.0)
    created_by TEXT DEFAULT 'system',        -- Creator ID (v2.0)
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);
```

### 1.5 Quizzes
Assessment and testing content.

```sql
CREATE TABLE quizzes (
    quiz_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,                     -- Quiz title
    description TEXT,                        -- Quiz description
    language_id VARCHAR(10),                 -- Target language
    level TEXT CHECK(level IN ('beginner', 'intermediate', 'advanced')),
    questions TEXT NOT NULL,                 -- Questions (JSON format)
    time_limit INTEGER,                      -- Time limit in minutes (v2.0)
    passing_score INTEGER DEFAULT 70,        -- Passing score percentage (v2.0)
    xp_reward INTEGER DEFAULT 20,            -- XP earned (v2.0)
    published BOOLEAN DEFAULT 1,             -- Published flag (v2.0)
    verified BOOLEAN DEFAULT 0,              -- Admin verified (v2.0)
    created_by TEXT DEFAULT 'system',        -- Creator ID (v2.0)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (language_id) REFERENCES languages(language_id)
);
```

---

## 2. User Management

### 2.1 Users
Local user records linked to Firebase Auth.

```sql
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    firebase_uid TEXT UNIQUE NOT NULL,       -- Firebase Auth UID
    email TEXT UNIQUE NOT NULL,              -- User email
    display_name TEXT,                       -- Display name
    role TEXT CHECK(role IN ('guest', 'student', 'teacher', 'admin')) NOT NULL,
    level INTEGER DEFAULT 1,                 -- User level
    xp INTEGER DEFAULT 0,                    -- Experience points
    coins INTEGER DEFAULT 0,                 -- Virtual coins
    ngondo_coins INTEGER DEFAULT 0,          -- Premium currency (v2.0)
    subscription TEXT CHECK(subscription IN ('free', 'premium', 'family', 'teacher', 'enterprise')) DEFAULT 'free',
    subscription_expires INTEGER,            -- Unix timestamp (v2.0)
    is_active BOOLEAN DEFAULT 1,             -- Active flag (v2.0)
    email_verified BOOLEAN DEFAULT 0,        -- Email verified (v2.0)
    two_factor_enabled BOOLEAN DEFAULT 0,    -- 2FA enabled (v2.0)
    preferences TEXT,                        -- User preferences (JSON)
    stats TEXT,                              -- User statistics (JSON, v2.0)
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    last_login INTEGER DEFAULT (strftime('%s', 'now'))
);
```

### 2.2 Daily Limits
Guest user quota enforcement.

```sql
CREATE TABLE daily_limits (
    limit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,                         -- User ID (0 for guest)
    date TEXT NOT NULL,                      -- Date (YYYY-MM-DD)
    lessons_used INTEGER DEFAULT 0,          -- Lessons accessed today
    readings_used INTEGER DEFAULT 0,         -- Readings accessed today
    quizzes_used INTEGER DEFAULT 0,          -- Quizzes accessed today
    max_lessons INTEGER DEFAULT 5,           -- Daily lesson limit
    max_readings INTEGER DEFAULT 5,          -- Daily reading limit
    max_quizzes INTEGER DEFAULT 5,           -- Daily quiz limit
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, date)
);
```

---

## 3. Progress & Gamification

### 3.1 User Progress
Tracks learning progress for lessons and quizzes.

```sql
CREATE TABLE user_progress (
    progress_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_type TEXT CHECK(content_type IN ('lesson', 'quiz')) NOT NULL,
    content_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    score INTEGER,                           -- Score achieved
    time_spent INTEGER DEFAULT 0,            -- Time spent in seconds
    attempts INTEGER DEFAULT 0,              -- Number of attempts
    started_at INTEGER,                      -- Unix timestamp
    completed_at INTEGER,                    -- Unix timestamp
    last_accessed INTEGER,                   -- Unix timestamp
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, content_type, content_id)
);
```

### 3.2 Achievements
Available achievements and badges.

```sql
CREATE TABLE achievements (
    achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,               -- Achievement code
    name TEXT NOT NULL,                      -- Display name
    description TEXT,                        -- Achievement description
    icon TEXT,                               -- Icon identifier
    category TEXT,                           -- Achievement category
    xp_reward INTEGER DEFAULT 0,             -- XP reward
    coin_reward INTEGER DEFAULT 0,           -- Coin reward
    required_count INTEGER DEFAULT 1,        -- Required count to unlock
    active BOOLEAN DEFAULT 1                 -- Active flag
);
```

### 3.3 User Achievements
User's earned achievements.

```sql
CREATE TABLE user_achievements (
    user_achievement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id INTEGER NOT NULL,
    earned_at INTEGER DEFAULT (strftime('%s', 'now')),
    progress INTEGER DEFAULT 0,              -- Progress towards achievement
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    UNIQUE(user_id, achievement_id)
);
```

---

## 4. Teacher & Admin Features

### 4.1 Teacher Content
Tracks teacher-created content for review.

```sql
CREATE TABLE teacher_content (
    content_id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    content_type TEXT CHECK(content_type IN ('translation', 'lesson', 'quiz')) NOT NULL,
    reference_id INTEGER,                    -- ID of created content
    status TEXT CHECK(status IN ('draft', 'pending_review', 'approved', 'rejected')) DEFAULT 'draft',
    reviewed_by INTEGER,                     -- Admin who reviewed
    review_notes TEXT,                       -- Review feedback
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    reviewed_at INTEGER,                     -- Review timestamp
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);
```

### 4.2 Admin Logs
Administrative action logging.

```sql
CREATE TABLE admin_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action TEXT NOT NULL,                    -- Action performed
    target_type TEXT,                        -- Target entity type
    target_id INTEGER,                       -- Target entity ID
    details TEXT,                            -- Action details (JSON)
    ip_address TEXT,                         -- IP address
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## 5. System Tables

### 5.1 App Settings
Application configuration and settings.

```sql
CREATE TABLE app_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT,                      -- Setting value
    setting_type TEXT,                       -- Data type hint
    description TEXT,                        -- Setting description
    updated_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_by INTEGER,                      -- Admin who updated
    FOREIGN KEY (updated_by) REFERENCES users(user_id) ON DELETE SET NULL
);
```

### 5.2 Migrations
Database migration tracking.

```sql
CREATE TABLE migrations (
    migration_id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT UNIQUE NOT NULL,            -- Migration version
    description TEXT,                        -- Migration description
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    checksum TEXT,                           -- Migration checksum
    execution_time INTEGER                   -- Execution time in ms
);
```

---

## 6. Indexes

### Performance Indexes
```sql
-- Translations
CREATE INDEX idx_translations_language ON translations(language_id);
CREATE INDEX idx_translations_category ON translations(category_id);
CREATE INDEX idx_translations_french ON translations(french_text);
CREATE INDEX idx_translations_created_by ON translations(created_by);

-- Lessons
CREATE INDEX idx_lessons_language ON lessons(language_id);
CREATE INDEX idx_lessons_level ON lessons(level);
CREATE INDEX idx_lessons_order ON lessons(order_index);
CREATE INDEX idx_lessons_created_by ON lessons(created_by);

-- Quizzes
CREATE INDEX idx_quizzes_language ON quizzes(language_id);
CREATE INDEX idx_quizzes_level ON quizzes(level);
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by);

-- Users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- User Progress
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_content ON user_progress(content_type, content_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);

-- User Achievements
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- Teacher Content
CREATE INDEX idx_teacher_content_teacher ON teacher_content(teacher_id);
CREATE INDEX idx_teacher_content_status ON teacher_content(status);

-- Admin Logs
CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_timestamp ON admin_logs(timestamp);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);

-- Daily Limits
CREATE INDEX idx_daily_limits_user_date ON daily_limits(user_id, date);
```

---

## 7. Role-Based Access Control

### Guest (user_id = 0)
- **Dictionary**: Full read access
- **Lessons**: 5 per day limit
- **Readings**: 5 per day limit  
- **Quizzes**: 5 per day limit
- **Progress**: Local tracking only

### Student (authenticated)
- **Dictionary**: Full read access
- **Lessons**: Unlimited (with subscription)
- **Quizzes**: Unlimited (with subscription)
- **Progress**: Full tracking and sync

### Teacher (authenticated)
- **All Student permissions**
- **Content Creation**: Create/edit lessons, words, quizzes
- **Content Review**: Submit for admin approval
- **Statistics**: View own content performance

### Admin (authenticated)
- **All permissions**
- **User Management**: Create/edit/disable users
- **Content Moderation**: Approve/reject teacher content
- **System Settings**: Modify app settings
- **Analytics**: Full system analytics

---

## 8. Data Seeding

### Initial Data Requirements
1. **Languages**: 7 Cameroonian languages
2. **Categories**: Common word categories (greetings, food, family, etc.)
3. **Translations**: Core vocabulary (~1000+ entries)
4. **Lessons**: Basic lessons for each language
5. **Quizzes**: Assessment content
6. **Achievements**: Gamification rewards
7. **Settings**: Default app configuration

### Seed Data Location
- **JSON Format**: `src/assets/data/seed-data.json`
- **Python Script**: `docs/database-scripts/create_cameroon_db.py`
- **Auto-loading**: Via SQLite service on first run

---

## 9. Migration Strategy

### Version Control
- **Semantic Versioning**: `001_initial_schema`, `002_add_features`
- **Checksums**: Verify migration integrity
- **Rollback Support**: Down migrations where possible
- **Execution Tracking**: Time and error logging

### Migration Flow
1. Check current database version
2. Register all available migrations
3. Run pending migrations in order
4. Record successful migrations
5. Handle errors gracefully
6. Provide rollback capability

---

## 10. Firebase Integration Points

### Authentication Only
- **User Registration**: Create local user record
- **User Login**: Link Firebase UID to local user
- **Role Management**: Stored locally, not in Firebase
- **Profile Data**: Local storage with Firebase sync for non-sensitive data

### Real-time Services
- **Notifications**: Firebase Cloud Messaging
- **Analytics**: Firebase Analytics (anonymous)
- **Crash Reporting**: Firebase Crashlytics
- **Performance**: Firebase Performance Monitoring

### Data Boundaries
- **Local (SQLite)**: All user data, content, progress, settings
- **Firebase**: Auth tokens, analytics events, push notifications
- **No Sensitive Data**: Never store sensitive user data in Firebase

This schema provides a robust foundation for the hybrid architecture while maintaining data sovereignty and offline-first capabilities.
