// IndexedDB Storage Utility for handling large app state (e.g. Hero Banners, Media Items, Base64 Images)
const DB_NAME = 'HakkivedaDB';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';

function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        try {
          const db = request.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        } catch (_) {}
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch (_) {
      resolve(null);
    }
  });
}

export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result !== undefined ? request.result : null);
        request.onerror = () => resolve(null);
      } catch (_) {
        resolve(null);
      }
    });
  } catch (_) {
    return null;
  }
}

export async function idbSet<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put(value, key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  } catch (_) {
    return false;
  }
}

export async function idbDel(key: string): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.delete(key);
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  } catch (_) {
    return false;
  }
}

export async function idbClear(): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.clear();
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      } catch (_) {
        resolve(false);
      }
    });
  } catch (_) {
    return false;
  }
}
