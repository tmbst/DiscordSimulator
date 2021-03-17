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
      return false;
    }
    return true;
  },
};
