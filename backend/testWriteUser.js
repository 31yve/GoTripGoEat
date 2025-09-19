// Script untuk test tulis ke users.json langsung dari backend
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, "data/users.json");

function readUsers() {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeUsers(users) {
  fs.writeFileSync(file, JSON.stringify(users, null, 2));
}

const users = readUsers();
const newUser = {
  id: users.length ? users[users.length - 1].id + 1 : 1,
  username: "testuser",
  email: "testuser@example.com",
  password: "test123",
  full_name: "Test User",
  role: "student",
  phone: "08123456789"
};

users.push(newUser);
try {
  writeUsers(users);
  console.log("Berhasil menulis user baru ke users.json");
} catch (err) {
  console.error("Gagal menulis ke users.json:", err);
}
