export const generateRandomString = (len) =>
  [...Array(len)].map(() => ((Math.random() * 36) | 0).toString(36)).join("");
