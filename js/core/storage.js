const STORAGE_PREFIX = "eolas:";

export function readSetting(key, fallback = null) {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    console.warn(`Unable to read setting: ${key}`, error);
    return fallback;
  }
}

export function writeSetting(key, value) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Unable to save setting: ${key}`, error);
    return false;
  }
}
