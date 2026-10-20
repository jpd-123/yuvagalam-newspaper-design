const DB_NAME = 'SatwikaPublisherDB';
const DB_VERSION = 1;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject('IndexedDB error: ' + event.target.errorCode);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('masterLayouts')) {
        db.createObjectStore('masterLayouts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('dailyNews')) {
        db.createObjectStore('dailyNews', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('assets')) {
        db.createObjectStore('assets', { keyPath: 'key' });
      }
    };
  });
};

// డేటా సేవ్ చేయడం
export const saveData = async (storeName, data) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
};

// డేటా తీసుకురావడం
export const getData = async (storeName, key) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(null);
  });
};
                                   
