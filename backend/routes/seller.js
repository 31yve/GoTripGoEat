// backend/routes/sellers.js
import express from "express";
import fs from "fs";
import path from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/sellers.json");

const readSellers = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(filePath, "[]");
      return [];
    }
    return [];
  }
};

router.get("/", (req, res) => {
  res.json(readSellers());
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sellers = readSellers();
  const seller = sellers.find(s => s.id === parseInt(id));
  if (!seller) return res.status(404).json({ error: "Seller not found" });
  res.json(seller);
});

export default router;