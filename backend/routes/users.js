import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Prevent GET /users/register confusion
router.get("/register", (req, res) => {
  res.status(405).json({ error: "Gunakan POST untuk register, bukan GET" });
});

// ✅ bikin ulang __dirname untuk ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path file users.json (aman & portable)
const file = path.join(__dirname, "../data/users.json");

// 🔹 Helper function baca/tulis JSON
function readUsers() {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeUsers(users) {
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}

// 📍 Get all users
router.get("/", (req, res) => {
  const users = readUsers();
  res.json(users);
});

// 📍 Get user by ID
router.get("/:id", (req, res) => {
  const users = readUsers();
  const user = users.find((u) => String(u.id) === String(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// 📍 Register user baru
router.post("/register", (req, res) => {
  console.log("Register request body:", req.body); // Debug log
  const users = readUsers();
  const { username, email, password, full_name, role, phone } = req.body;

  if (!username || !email || !password || !role) {
    console.log("Register error: Data tidak lengkap");
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  if (users.find((u) => u.email === email)) {
    console.log("Register error: Email sudah terdaftar");
    return res.status(400).json({ error: "Email sudah terdaftar" });
  }

  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    username,
    email,
    password,
    full_name: full_name || "",
    role,
    phone: phone || ""
  };

  users.push(newUser);
  try {
    writeUsers(users);
    console.log("User registered and written to file:", newUser);
    res.json({ message: "User registered", user: newUser });
  } catch (err) {
    console.error("Register write error:", err);
    res.status(500).json({ error: "Gagal menulis data user" });
  }
});

// 📍 Login user
router.post("/login", (req, res) => {
  const users = readUsers();
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user)
    return res.status(401).json({ error: "Email atau password salah" });

  res.json({
    message: "Login sukses",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  });
});

// 📍 Update profile user
router.put("/:id", (req, res) => {
  const users = readUsers();
  const index = users.findIndex((u) => String(u.id) === String(req.params.id));
  if (index === -1) return res.status(404).json({ error: "User not found" });

  users[index] = { ...users[index], ...req.body };
  writeUsers(users);

  res.json({ message: "Profile updated", user: users[index] });
});

export default router;
