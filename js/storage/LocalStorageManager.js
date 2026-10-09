// File: js/storage/LocalStorageManager.js
// Project: Satvika Publisher
// Purpose: Safe browser local-storage operations

const DEFAULT_PREFIX = "satvika_publisher";

export class LocalStorageManager {
  constructor(prefix = DEFAULT_PREFIX) {
    this.prefix = String(prefix || DEFAULT_PREFIX).trim();
  }

  makeKey(key) {
    const normalizedKey = String(key || "").trim();

    if (!normalizedKey) {
      throw new Error("Storage key ఖాళీగా ఉండకూడదు.");
    }

    return `${this.prefix}:${normalizedKey}`;
  }

  isAvailable() {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }

      const testKey = `${this.prefix}:__storage_test__`;

      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);

      return true;
    } catch {
      return false;
    }
  }

  get(key, fallback = null) {
    if (!this.isAvailable()) {
      return fallback;
    }

    try {
      const storedValue = window.localStorage.getItem(this.makeKey(key));

      if (storedValue === null) {
        return fallback;
      }

      return JSON.parse(storedValue);
    } catch (error) {
      console.error("LocalStorage read failed:", error);
      return fallback;
    }
  }

  set(key, value) {
    if (!this.isAvailable()) {
      throw new Error(
        "బ్రౌజర్ LocalStorage అందుబాటులో లేదు. IndexedDB లేదా ఇతర నిల్వను ఉపయోగించండి."
      );
    }

    try {
      const serializedValue = JSON.stringify(value);

      if (serializedValue === undefined) {
        throw new Error("ఈ విలువను JSON రూపంలో సేవ్ చేయలేము.");
      }

      window.localStorage.setItem(
        this.makeKey(key),
        serializedValue
      );

      return true;
    } catch (error) {
      if (error instanceof Error && error.name === "QuotaExceededError") {
        throw new Error(
          "బ్రౌజర్ నిల్వ పరిమితి నిండిపోయింది. పెద్ద ఫొటోలను IndexedDBలో నిల్వ చేయండి."
        );
      }

      throw error;
    }
  }

  remove(key) {
    if (!this.isAvailable()) {
      return false;
    }

    window.localStorage.removeItem(this.makeKey(key));

    return true;
  }

  has(key) {
    if (!this.isAvailable()) {
      return false;
    }

    return window.localStorage.getItem(this.makeKey(key)) !== null;
  }

  getAllKeys() {
    if (!this.isAvailable()) {
      return [];
    }

    const keys = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);

      if (key && key.startsWith(`${this.prefix}:`)) {
        keys.push(key.slice(this.prefix.length + 1));
      }
    }

    return keys;
  }

  clear() {
    if (!this.isAvailable()) {
      return false;
    }

    const keys = this.getAllKeys();

    for (const key of keys) {
      window.localStorage.removeItem(this.makeKey(key));
    }

    return true;
  }
}

export const localStorageManager = new LocalStorageManager();
