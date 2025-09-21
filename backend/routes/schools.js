import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Fix __dirname di ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/schools.json");

console.log("Schools file path:", filePath); // Debug

// Fungsi baca file secara sinkron
const readSchools = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading schools file:", err);
    if (err.code === 'ENOENT') {
      fs.writeFileSync(filePath, "[]");
      return [];
    }
    throw err;
  }
};

// Fungsi tulis file secara sinkron
const writeSchools = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Data sekolah berhasil disimpan.');
    return true;
  } catch (err) {
    console.error("❌ Error writing schools file:", err);
    throw err;
  }
};

// GET: Mendapatkan semua data sekolah
router.get("/", (req, res) => {
  try {
    const schools = readSchools();
    res.json(schools);
  } catch (err) {
    console.error("GET /schools error:", err);
    res.status(500).json({ error: "Gagal membaca data sekolah" });
  }
});

// POST: Menambahkan sekolah baru
router.post("/", (req, res) => {
  console.log("POST /schools - Request body:", req.body);
  
  const { name, address = "", contact = "" } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Nama sekolah wajib diisi" });
  }

  try {
    const schools = readSchools();
    const newSchool = {
      id: Date.now(),
      name: name.trim(),
      address: address.trim(),
      contact: contact.trim(),
      students: 0,
      canteens: 0,
    };

    schools.push(newSchool);
    const success = writeSchools(schools);
    
    if (success) {
      console.log("✅ School added:", newSchool);
      res.status(201).json(newSchool);
    } else {
      throw new Error("Failed to write file");
    }
  } catch (err) {
    console.error("POST /schools error:", err);
    res.status(500).json({ error: "Gagal menambahkan sekolah" });
  }
});

// PUT: Mengedit sekolah
router.put("/:id", (req, res) => {
  console.log("PUT /schools/:id - Params:", req.params, "Body:", req.body);
  
  const { id } = req.params;
  const { name, address, contact } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Nama sekolah wajib diisi" });
  }

  try {
    const schools = readSchools();
    const schoolIndex = schools.findIndex((school) => school.id === parseInt(id));

    if (schoolIndex === -1) {
      return res.status(404).json({ error: "Sekolah tidak ditemukan" });
    }

    schools[schoolIndex] = {
      ...schools[schoolIndex],
      name: name.trim(),
      address: address !== undefined ? address.trim() : schools[schoolIndex].address,
      contact: contact !== undefined ? contact.trim() : schools[schoolIndex].contact,
    };

    const success = writeSchools(schools);
    
    if (success) {
      console.log("✅ School updated:", schools[schoolIndex]);
      res.status(200).json(schools[schoolIndex]);
    } else {
      throw new Error("Failed to write file");
    }
  } catch (err) {
    console.error("PUT /schools/:id error:", err);
    res.status(500).json({ error: "Gagal mengedit sekolah" });
  }
});

// DELETE: Menghapus sekolah
router.delete("/:id", (req, res) => {
  console.log("DELETE /schools/:id - Params:", req.params);
  
  const { id } = req.params;
  try {
    const schools = readSchools();
    const initialLength = schools.length;
    const updatedSchools = schools.filter((school) => school.id !== parseInt(id));

    if (updatedSchools.length === initialLength) {
      return res.status(404).json({ error: "Sekolah tidak ditemukan" });
    }

    const success = writeSchools(updatedSchools);
    
    if (success) {
      console.log("✅ School deleted, ID:", id);
      res.status(200).json({ message: "Sekolah berhasil dihapus" });
    } else {
      throw new Error("Failed to write file");
    }
  } catch (err) {
    console.error("DELETE /schools/:id error:", err);
    res.status(500).json({ error: "Gagal menghapus sekolah" });
  }
});

export default router;