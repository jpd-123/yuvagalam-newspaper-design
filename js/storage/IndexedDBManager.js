// File: js/storage/IndexedDBManager.js
// Project: Satvika Publisher
// Purpose: Persistent browser database

const DATABASE_NAME = "SatvikaPublisherDB";
const DATABASE_VERSION = 1;

const STORE_NAMES = [
  "masters",
  "editions",
  "advertisements",
  "photos",
  "settings"
];

export class IndexedDBManager {
  constructor({
    databaseName = DATABASE_NAME,
    version = DATABASE_VERSION
  } = {}) {
    this.databaseName = databaseName;
    this.version = version;
    this.databasePromise = null;
  }

  isSupported() {
    return typeof indexedDB !== "undefined";
  }

  open() {
    if (!this.isSupported()) {
      return Promise.reject(
        new Error("ఈ బ్రౌజర్‌లో IndexedDB అందుబాటులో లేదు.")
      );
    }

    if (this.databasePromise) {
      return this.databasePromise;
    }

    this.databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(
        this.databaseName,
        this.version
      );

      request.onupgradeneeded = () => {
        const database = request.result;

        for (const storeName of STORE_NAMES) {
          if (!database.objectStoreNames.contains(storeName)) {
            database.createObjectStore(storeName, {
              keyPath: "id"
            });
          }
        }
      };

      request.onsuccess = () => {
        const database = request.result;

        database.onversionchange = () => {
          database.close();
          this.databasePromise = null;
        };

        resolve(database);
      };

      request.onerror = () => {
        this.databasePromise = null;

        reject(
          request.error ||
          new Error("IndexedDB తెరవడంలో సమస్య ఏర్పడింది.")
        );
      };

      request.onblocked = () => {
        console.warn(
          "IndexedDB అప్‌డేట్ నిలిచిపోయింది. ఇతర ఓపెన్ ట్యాబ్‌లను మూసివేయండి."
        );
      };
    });

    return this.databasePromise;
  }

  validateStoreName(storeName) {
    if (!STORE_NAMES.includes(storeName)) {
      throw new Error(`తెలియని IndexedDB store: ${storeName}`);
    }
  }

  async put(storeName, record) {
    this.validateStoreName(storeName);

    if (!record || typeof record !== "object") {
      throw new Error("సేవ్ చేయడానికి సరైన రికార్డు అవసరం.");
    }

    if (record.id === undefined || record.id === null || record.id === "") {
      throw new Error("రికార్డుకు ప్రత్యేకమైన id అవసరం.");
    }

    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        [storeName],
        "readwrite"
      );

      const store = transaction.objectStore(storeName);

      store.put(record);

      transaction.oncomplete = () => resolve(record);

      transaction.onerror = () => {
        reject(
          transaction.error ||
          new Error("రికార్డు సేవ్ చేయడంలో సమస్య ఏర్పడింది.")
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
          new Error("రికార్డు సేవ్ ప్రక్రియ రద్దయింది.")
        );
      };
    });
  }

  async get(storeName, id) {
    this.validateStoreName(storeName);

    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        [storeName],
        "readonly"
      );

      const request = transaction
        .objectStore(storeName)
        .get(id);

      request.onsuccess = () => {
        resolve(request.result ?? null);
      };

      request.onerror = () => {
        reject(
          request.error ||
          new Error("రికార్డు చదవడంలో సమస్య ఏర్పడింది.")
        );
      };
    });
  }

  async getAll(storeName) {
    this.validateStoreName(storeName);

    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        [storeName],
        "readonly"
      );

      const request = transaction
        .objectStore(storeName)
        .getAll();

      request.onsuccess = () => resolve(request.result || []);

      request.onerror = () => {
        reject(
          request.error ||
          new Error("రికార్డులను చదవడంలో సమస్య ఏర్పడింది.")
        );
      };
    });
  }

  async delete(storeName, id) {
    this.validateStoreName(storeName);

    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        [storeName],
        "readwrite"
      );

      transaction.objectStore(storeName).delete(id);

      transaction.oncomplete = () => resolve(true);

      transaction.onerror = () => {
        reject(
          transaction.error ||
          new Error("రికార్డు తొలగించడంలో సమస్య ఏర్పడింది.")
        );
      };

      transaction.onabort = () => {
        reject(
          transaction.error ||
          new Error("రికార్డు తొలగింపు రద్దయింది.")
        );
      };
    });
  }

  async clearStore(storeName) {
    this.validateStoreName(storeName);

    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        [storeName],
        "readwrite"
      );

      transaction.objectStore(storeName).clear();

      transaction.oncomplete = () => resolve(true);

      transaction.onerror = () => {
        reject(
          transaction.error ||
          new Error("డేటా తొలగించడంలో సమస్య ఏర్పడింది.")
        );
      };
    });
  }

  async count(storeName) {
    this.validateStoreName(storeName);

    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        [storeName],
        "readonly"
      );

      const request = transaction
        .objectStore(storeName)
        .count();

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => {
        reject(
          request.error ||
          new Error("రికార్డుల సంఖ్యను లెక్కించలేకపోయాం.")
        );
      };
    });
  }

  async saveMaster(master) {
    return this.put("masters", master);
  }

  async getMaster(id) {
    return this.get("masters", id);
  }

  async getAllMasters() {
    return this.getAll("masters");
  }

  async deleteMaster(id) {
    return this.delete("masters", id);
  }

  async saveEdition(edition) {
    return this.put("editions", edition);
  }

  async getEdition(id) {
    return this.get("editions", id);
  }

  async getAllEditions() {
    return this.getAll("editions");
  }

  async deleteEdition(id) {
    return this.delete("editions", id);
  }

  async saveAdvertisement(advertisement) {
    return this.put("advertisements", advertisement);
  }

  async getAllAdvertisements() {
    return this.getAll("advertisements");
  }

  async deleteAdvertisement(id) {
    return this.delete("advertisements", id);
  }

  async savePhoto(photo) {
    return this.put("photos", photo);
  }

  async getPhoto(id) {
    return this.get("photos", id);
  }

  async deletePhoto(id) {
    return this.delete("photos", id);
  }

  async saveSetting(setting) {
    return this.put("settings", setting);
  }

  async getSetting(id) {
    return this.get("settings", id);
  }
}

export const indexedDBManager = new IndexedDBManager();
