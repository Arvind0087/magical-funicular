export const isJson = (data) => {
  try {
    JSON.parse(data);
  } catch (e) {
    return false;
  }
  return true;
};


export function ensureJSONString(value) {
  if (typeof value === 'string') {
    try {
      JSON.parse(value); // Check if it is a valid JSON string
      return [value]; // Return the original value in an array since it is already a JSON string
    } catch (error) {
      // Not a valid JSON string, continue to stringify the value
    }
  }

  return [JSON.stringify(value)];
}
