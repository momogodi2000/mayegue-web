type SyncTask = () => Promise<void>;

class SyncService {
  private syncQueue: Array<SyncTask> = [];
  private isSyncing = false;

  enqueue(task: SyncTask): void {
    this.syncQueue.push(task);
    void this.run();
  }

  private async run(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;
    try {
      while (this.syncQueue.length > 0) {
        const task = this.syncQueue.shift();
        if (task) {
          await task();
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  async syncDictionary(): Promise<void> {
    // TODO: implement real sync with Firestore and IndexedDB
    return;
  }

  async syncLessons(): Promise<void> {
    return;
  }

  async syncProgress(_userId: string): Promise<void> {
    return;
  }

  async autoSync(): Promise<void> {
    this.enqueue(() => this.syncDictionary());
    this.enqueue(() => this.syncLessons());
  }
}

export const syncService = new SyncService();


