module.exports = {
  isObject(obj) {
    const type = typeof obj;
    if (type !== "object" || obj === null) {
      return false;
    }
    return true;
  },
};
