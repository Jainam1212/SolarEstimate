export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  email = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) return false;
  if (email.includes("..")) return false;
  return true;
}

export function isValidName(name) {
  if (typeof name !== "string") return false;
  name = name.trim();
  if (name.length < 2) return false;
  const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
  return nameRegex.test(name);
}

export function isValidPassword(password) {
  if (typeof password !== "string") return false;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|;:'",.<>\/?`~]).{8,}$/;
  return passwordRegex.test(password);
}
