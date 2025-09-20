import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Setup path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, "../data/users.json");

// Helper baca users.json
function readUsers() {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// Helper tulis users.json
function writeUsers(users) {
  fs.writeFileSync(file, JSON.stringify(users, null, 2), "utf-8");
}

// Login route (username atau email)
router.post("/login", (req, res) => {
  const { identifier, password } = req.body; // identifier = username/email

  if (!identifier || !password) {
    return res.status(400).json({ message: "Username/email & password wajib diisi" });
  }

  const users = readUsers();
  const user = users.find(
    (u) =>
      (u.username === identifier || u.email === identifier) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Username/email atau password salah" });
  }

  const token = `fake-token-${user.username}-${Date.now()}`;
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: "Login sukses",
    token,
    user: { ...userWithoutPassword, role: user.role.toLowerCase() },
  });
});

// Register route
router.post("/register", (req, res) => {
  const { username, email, phone, password } = req.body;

  if (!username || !email || !phone || !password) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "Username sudah terdaftar" });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email sudah terdaftar" });
  }

  const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    username,
    full_name: username,
    email,
    password,
    role: "student",
    phone
  };

  users.push(newUser);
  writeUsers(users);

  res.json({
    message: "Register berhasil",
    user: newUser
  });
});

export default router;
