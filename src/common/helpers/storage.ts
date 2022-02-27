export interface IStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  setObject: (key: string, value: Record<string, unknown>) => void;
  getObject: (key: string) => Record<string, unknown> | null;
  remove: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  length: number;
}

function storageFactory(storage: Storage, prefix = ''): IStorage {
  let inMemoryStorage: { [key: string]: string } = {};
  const length = 0;

  const isSupported = ((): boolean => {
    try {
      const testKey = '__test-key__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  })();

  function getPrefixedKey(key: string): string {
    return prefix + key;
  }

  function clear(): void {
    if (isSupported) {
      storage.clear();
    } else {
      inMemoryStorage = {};
    }
  }

  function get(key: string): string | null {
    const storeKey = getPrefixedKey(key);
    if (isSupported) {
      return storage.getItem(storeKey);
    }
    // eslint-disable-next-line no-prototype-builtins
    if (inMemoryStorage.hasOwnProperty(storeKey)) {
      return inMemoryStorage[storeKey];
    }
    return null;
  }

  function set(key: string, value: string): void {
    const storeKey = getPrefixedKey(key);
    if (isSupported) {
      storage.setItem(storeKey, value);
    } else {
      inMemoryStorage[storeKey] = String(value);
    }
  }

  function setObject(key: string, value: Record<string, unknown>): void {
    set(key, JSON.stringify(value));
  }

  function getObject(key: string): Record<string, unknown> | null {
    const value = get(key) as string;
    try {
      return JSON.parse(value) as Record<string, unknown> | null;
    } catch (e) {
      return {};
    }
  }

  function key(index: number): string | null {
    if (isSupported) {
      return storage.key(index);
    } else {
      return Object.keys(inMemoryStorage)[index] || null;
    }
  }

  function remove(key: string): void {
    const storeKey = getPrefixedKey(key);
    if (isSupported) {
      storage.removeItem(storeKey);
    } else {
      delete inMemoryStorage[storeKey];
    }
  }

  return {
    get,
    set,
    getObject,
    setObject,
    remove,
    clear,
    key,
    length,
  };
}

export const localStore = storageFactory(localStorage, 'MC-');
export const sessionStore = storageFactory(sessionStorage, 'MC-');
