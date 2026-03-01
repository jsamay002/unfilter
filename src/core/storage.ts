/*  ================================================================
    STORAGE ADAPTER — Platform-agnostic persistence
    
    Interface:  StorageAdapter
    Web impl:   WebStorageAdapter (localStorage)
    Mobile:     Swap in AsyncStorage/MMKV adapter with same interface
    
    All stores depend on this interface, never on localStorage directly.
    ================================================================ */

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/* ---- Web (localStorage) ---- */

export class WebStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
}

/* ---- Mobile stub (swap for AsyncStorage/MMKV) ---- */

// export class MobileStorageAdapter implements StorageAdapter {
//   async getItem(key: string) { return AsyncStorage.getItem(key); }
//   async setItem(key: string, value: string) { await AsyncStorage.setItem(key, value); }
//   async removeItem(key: string) { await AsyncStorage.removeItem(key); }
// }

/* ---- Singleton ---- */

let _adapter: StorageAdapter | null = null;

export function setStorageAdapter(adapter: StorageAdapter) {
  _adapter = adapter;
}

export function getStorageAdapter(): StorageAdapter {
  if (!_adapter) {
    // Default to web
    _adapter = new WebStorageAdapter();
  }
  return _adapter;
}

/* ---- Zustand persist helper ---- */

/**
 * Creates a Zustand-compatible storage object from our adapter.
 * Use with: persist(fn, { storage: createZustandStorage() })
 */
export function createZustandStorage() {
  const adapter = getStorageAdapter();
  return {
    getItem: async (name: string) => {
      const value = await adapter.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (name: string, value: unknown) => {
      await adapter.setItem(name, JSON.stringify(value));
    },
    removeItem: async (name: string) => {
      await adapter.removeItem(name);
    },
  };
}
