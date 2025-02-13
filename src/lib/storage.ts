import { Snippet } from "../types/snippet";

export class StorageService {
  private static SNIPPETS_KEY = "snippets";
  private static LAST_SYNC_KEY = "lastSync";

  static async getSnippets(): Promise<Snippet[]> {
    const result = await chrome.storage.local.get(this.SNIPPETS_KEY);
    return result[this.SNIPPETS_KEY] || [];
  }

  static async saveSnippet(snippet: Snippet): Promise<void> {
    const snippets = await this.getSnippets();
    const existingIndex = snippets.findIndex(s => s.id === snippet.id);
    
    if (existingIndex >= 0) {
      snippets[existingIndex] = snippet;
    } else {
      snippets.push(snippet);
    }

    await chrome.storage.local.set({ [this.SNIPPETS_KEY]: snippets });
  }

  static async deleteSnippet(id: string): Promise<void> {
    const snippets = await this.getSnippets();
    const filteredSnippets = snippets.filter(s => s.id !== id);
    await chrome.storage.local.set({ [this.SNIPPETS_KEY]: filteredSnippets });
  }

  static async getLastSyncTime(): Promise<Date | null> {
    const result = await chrome.storage.local.get(this.LAST_SYNC_KEY);
    return result[this.LAST_SYNC_KEY] ? new Date(result[this.LAST_SYNC_KEY]) : null;
  }

  static async updateLastSyncTime(): Promise<void> {
    await chrome.storage.local.set({ [this.LAST_SYNC_KEY]: new Date().toISOString() });
  }
} 