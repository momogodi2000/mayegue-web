/**
 * Database Migration Service
 * Handles SQLite schema migrations and version tracking
 */

export interface Migration {
  version: string;
  description: string;
  up: (db: any) => void;
  down?: (db: any) => void;
  checksum?: string;
}

export interface MigrationRecord {
  migration_id: number;
  version: string;
  description: string;
  applied_at: string;
  checksum: string;
  execution_time: number;
}

export class MigrationsService {
  private db: any = null;
  private migrations: Migration[] = [];

  /**
   * Initialize the migrations service with a database instance
   */
  initialize(db: any): void {
    this.db = db;
    this.ensureMigrationsTable();
  }

  /**
   * Ensure the migrations table exists
   */
  private ensureMigrationsTable(): void {
    if (!this.db) throw new Error('Database not initialized');

    this.db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        migration_id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT UNIQUE NOT NULL,
        description TEXT,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        checksum TEXT,
        execution_time INTEGER
      )
    `);
  }

  /**
   * Register a migration
   */
  registerMigration(migration: Migration): void {
    this.migrations.push(migration);
  }

  /**
   * Register multiple migrations
   */
  registerMigrations(migrations: Migration[]): void {
    this.migrations.push(...migrations);
  }

  /**
   * Get current database version
   */
  getCurrentVersion(): string | null {
    if (!this.db) return null;

    const result = this.db.exec(`
      SELECT version FROM migrations 
      ORDER BY migration_id DESC 
      LIMIT 1
    `);

    if (result.length === 0 || result[0].values.length === 0) {
      return null;
    }

    return result[0].values[0][0] as string;
  }

  /**
   * Get all applied migrations
   */
  getAppliedMigrations(): MigrationRecord[] {
    if (!this.db) return [];

    const result = this.db.exec(`
      SELECT migration_id, version, description, applied_at, checksum, execution_time
      FROM migrations
      ORDER BY migration_id
    `);

    if (result.length === 0) return [];

    return result[0].values.map((row: any) => ({
      migration_id: row[0] as number,
      version: row[1] as string,
      description: row[2] as string,
      applied_at: row[3] as string,
      checksum: row[4] as string,
      execution_time: row[5] as number,
    }));
  }

  /**
   * Check if a migration has been applied
   */
  isMigrationApplied(version: string): boolean {
    if (!this.db) return false;

    const result = this.db.exec(`
      SELECT COUNT(*) as count FROM migrations WHERE version = ?
    `, [version]);

    if (result.length === 0) return false;

    const count = result[0].values[0][0] as number;
    return count > 0;
  }

  /**
   * Run pending migrations
   */
  async runPendingMigrations(): Promise<{ 
    applied: number; 
    skipped: number; 
    errors: string[] 
  }> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    let applied = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Sort migrations by version
    const sortedMigrations = [...this.migrations].sort((a, b) => 
      a.version.localeCompare(b.version)
    );

    for (const migration of sortedMigrations) {
      if (this.isMigrationApplied(migration.version)) {
        skipped++;
        console.log(`⏭️ Skipping migration ${migration.version} (already applied)`);
        continue;
      }

      try {
        const startTime = Date.now();
        
        console.log(`🔄 Applying migration ${migration.version}: ${migration.description}`);
        
        // Run the migration
        migration.up(this.db);
        
        const executionTime = Date.now() - startTime;
        
        // Record the migration
        this.db.run(`
          INSERT INTO migrations (version, description, checksum, execution_time)
          VALUES (?, ?, ?, ?)
        `, [
          migration.version,
          migration.description,
          migration.checksum || 'no-checksum',
          executionTime
        ]);
        
        applied++;
        console.log(`✅ Migration ${migration.version} applied successfully (${executionTime}ms)`);
      } catch (error) {
        const errorMsg = `Failed to apply migration ${migration.version}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    return { applied, skipped, errors };
  }

  /**
   * Rollback last migration (if down function is provided)
   */
  async rollbackLastMigration(): Promise<boolean> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const currentVersion = this.getCurrentVersion();
    if (!currentVersion) {
      console.log('No migrations to rollback');
      return false;
    }

    const migration = this.migrations.find(m => m.version === currentVersion);
    if (!migration) {
      throw new Error(`Migration ${currentVersion} not found in registered migrations`);
    }

    if (!migration.down) {
      throw new Error(`Migration ${currentVersion} does not have a rollback function`);
    }

    try {
      console.log(`🔄 Rolling back migration ${currentVersion}`);
      
      // Run the down migration
      migration.down(this.db);
      
      // Remove migration record
      this.db.run(`DELETE FROM migrations WHERE version = ?`, [currentVersion]);
      
      console.log(`✅ Migration ${currentVersion} rolled back successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to rollback migration ${currentVersion}:`, error);
      throw error;
    }
  }

  /**
   * Get migration summary
   */
  getSummary(): {
    currentVersion: string | null;
    totalMigrations: number;
    appliedMigrations: number;
    pendingMigrations: number;
  } {
    const currentVersion = this.getCurrentVersion();
    const applied = this.getAppliedMigrations();
    const pending = this.migrations.filter(m => !this.isMigrationApplied(m.version));

    return {
      currentVersion,
      totalMigrations: this.migrations.length,
      appliedMigrations: applied.length,
      pendingMigrations: pending.length,
    };
  }
}

export const migrationsService = new MigrationsService();
