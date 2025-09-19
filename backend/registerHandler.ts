import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

const USERS_FILE = path.join(__dirname, "data/users.json");

export async function registerUser({ email, noTelepon, password, konfirmasiPassword }: {
  email: string;
  noTelepon: string;
  password: string;
  konfirmasiPassword: string;
}) {
  // 1. Validasi input
  if (!email || !noTelepon || !password || !konfirmasiPassword) {
    return { success: false, error: "Semua field wajib diisi" };
  }
  if (password !== konfirmasiPassword) {
    return { success: false, error: "Password dan konfirmasi tidak sama" };
  }
  if (password.length < 6) {
    return { success: false, error: "Password minimal 6 karakter" };
  }

  // 2. Baca data lama
  let users: any[] = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  }
  if (users.find(u => u.email === email)) {
    return { success: false, error: "Email sudah terdaftar" };
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Simpan data baru
  const newUser = {
    id: randomUUID(),
    email,
    noTelepon,
    password: hashedPassword,
    role: "siswa"
  };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  // 5. Respon sukses
  return { success: true, user: newUser };
}
