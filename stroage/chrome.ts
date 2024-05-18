interface ChromeStorageArea {
  get(keys: string | string[] | null): Promise<{ [key: string]: any }>;
  set(items: { [key: string]: any }): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
}

interface ChromeStorage {
  local: ChromeStorageArea;
  sync: ChromeStorageArea;
}

const chromeStorage: ChromeStorage = {
  local: {
    get(keys: string | string[] | null): Promise<{ [key: string]: any }> {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
    },
    set(items: { [key: string]: any }): Promise<void> {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
    remove(keys: string | string[]): Promise<void> {
      return new Promise((resolve, reject) => {
        chrome.storage.local.remove(keys, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
    clear(): Promise<void> {
      return new Promise((resolve, reject) => {
        chrome.storage.local.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
  },
  sync: {
    get(keys: string | string[] | null): Promise<{ [key: string]: any }> {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
    },
    set(items: { [key: string]: any }): Promise<void> {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.set(items, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
    remove(keys: string | string[]): Promise<void> {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.remove(keys, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
    clear(): Promise<void> {
      return new Promise((resolve, reject) => {
        chrome.storage.sync.clear(() => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    },
  },
};
