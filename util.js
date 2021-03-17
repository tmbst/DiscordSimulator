module.exports = {
  strToUserID(str) {
    const start = str.lastIndexOf("!");
    const end = str.lastIndexOf(">");
    if (start === -1 || end === -1) return "";
    return str.substring(start + 1, end);
  },
  strToChannelID(str) {
    const start = str.lastIndexOf("#");
    const end = str.lastIndexOf(">");
    if (start === -1 || end === -1) return "";
    return str.substring(start + 1, end);
  },
  isObject(obj) {
    const type = typeof obj;
    if (type !== "object" || obj === null) {
      return new TypeError(
        `Data should be a non null object. Instead received ${type}`
      );
    }
    return null;
  },
};
