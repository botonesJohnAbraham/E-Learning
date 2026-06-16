export type User = {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
};

const USERS_KEY = "e_learning_users";
const CURRENT_USER_KEY = "e_learning_current_user";

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(user: User): { ok: boolean; error?: string } {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
    return { ok: false, error: "Email already registered" };
  }
  users.push(user);
  saveUsers(users);
  return { ok: true };
}

export function loginUser(email: string, password: string): { ok: boolean; user?: User; error?: string } {
  const users = getUsers();
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found) return { ok: false, error: "User not found" };
  if (found.password !== password) return { ok: false, error: "Invalid password" };
  return { ok: true, user: found };
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
