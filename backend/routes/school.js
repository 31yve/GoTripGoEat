import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, "../data/datasekolah.json");

// Helper baca JSON sekolah
function readSchools() {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

// Helper tulis JSON sekolah
function writeSchools(schools) {
  fs.writeFileSync(file, JSON.stringify(schools, null, 2), "utf-8");
}

// GET semua sekolah
router.get("/", (req, res) => {
  const schools = readSchools();
  res.json(schools);
});

// POST tambah sekolah (untuk admin)
router.post("/add", (req, res) => {
  const { name, location, email } = req.body;
  if (!name || !location || !email) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const schools = readSchools();
  const newId = schools.length ? Math.max(...schools.map(s => s.id)) + 1 : 1;

  const newSchool = { id: newId, name, location, email };
  schools.push(newSchool);
  writeSchools(schools);

  res.json({ message: "Sekolah berhasil ditambahkan", school: newSchool });
});

export default router;
