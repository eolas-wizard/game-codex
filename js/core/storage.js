const PREFIX = "eolas:";

export function readValue(key, fallback) {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    console.warn(`Unable to read ${key}.`, error);
    return fallback;
  }
}

export function writeValue(key, value) {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Unable to save ${key}.`, error);
    return false;
  }
}
