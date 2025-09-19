import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// ✅ Setup path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, "../data/users.json");

// 📍 Helper baca users.json
function readUsers() {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// 📍 Helper tulis users.json
function writeUsers(users) {
  fs.writeFileSync(file, JSON.stringify(users, null, 2), "utf-8");
}

// 📍 Login route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username & password wajib diisi" });
  }

  const users = readUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Username atau password salah" });
  }

  const token = `fake-token-${user.username}-${Date.now()}`;

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    message: "Login sukses",
    token,
    user: { ...userWithoutPassword, role: user.role.toLowerCase() },
  });
});

// 📍 Register route
router.post("/register", (req, res) => {
  const { email, phone, password } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ error: "Email, password, dan phone wajib diisi" });
  }

  const users = readUsers();

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email sudah terdaftar" });
  }

  const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;

  const newUser = {
    id: newId,
    username: email.split("@")[0],
    full_name: email.split("@")[0],
    email,
    password, // langsung simpan tanpa hash
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
