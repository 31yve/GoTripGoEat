import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "../data/users.json");

// BACA file users.json
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf-8");
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

// TULIS ke file users.json
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// Secret JWT
const SECRET_KEY = "supersecretkey123";

// ================== REGISTER ==================
router.post("/register", (req, res) => {
  const { username, email, password, full_name, role, phone } = req.body;

  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  let users = readUsers();

  // Cek duplikat
  const existUser = users.find(
    (u) => u.username === username || u.email === email
  );
  if (existUser) {
    return res.status(400).json({ message: "Username atau email sudah terdaftar" });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    username,
    email,
    password, // ⚠️ sebaiknya di-hash (misal bcrypt), tapi ini plain untuk demo
    full_name,
    role: role || "student",
    phone: phone || "",
  };

  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, {
    expiresIn: "7d",
  });

  res.json({ user: newUser, token });
});

// ================== LOGIN ==================
router.post("/login", (req, res) => {
  const { identifier, password } = req.body; // identifier bisa username / email
  if (!identifier || !password) {
    return res.status(400).json({ message: "Username/email dan password wajib diisi" });
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

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: "7d",
  });

  res.json({ user, token });
});

export default router;
