import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
}

async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users.json:', error);
    return false;
  }
}

router.post('/login', async (req, res) => {
  console.log('Received POST /login', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email dan password wajib diisi' });
  }

  const users = await readUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Email atau password salah' });
  }

  const token = 'token-' + Date.now();
  const updatedUsers = users.map(u => u.id === user.id ? { ...u, token } : u);
  const success = await writeUsers(updatedUsers);

  if (success) {
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase(),
        school: user.school
      }
    });
  } else {
    res.status(500).json({ success: false, error: 'Gagal login' });
  }
});

router.post('/register', async (req, res) => {
  console.log('Received POST /register', req.body);
  const { name, email, password, role, school, phone } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, error: 'Field wajib diisi' });
  }

  const users = await readUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, error: 'Email sudah terdaftar' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role: role.toLowerCase(),
    school,
    phone,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  const success = await writeUsers(users);

  if (success) {
    const token = 'token-' + Date.now();
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        school: newUser.school
      }
    });
  } else {
    res.status(500).json({ success: false, error: 'Gagal registrasi' });
  }
});

export default router;