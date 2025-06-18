export function flattenObject(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    const value = obj[key];
    const prefixedKey = prefix ? `${prefix}_${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        const nested = flattenObject(item, `${prefixedKey}_${i}`);
        Object.assign(result, nested);
      });
    } else if (typeof value === 'object' && value !== null) {
      const nested = flattenObject(value, prefixedKey);
      Object.assign(result, nested);
    } else {
      result[prefixedKey] = value;
    }
  }

  return result;
}