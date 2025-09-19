import express from "express";
import { authorize, requireLogin } from "../middleware/auth.js";

const router = express.Router();

// Semua user bisa GET menu
router.get("/", requireLogin, (req, res) => {
  res.json({ message: "List menu tersedia" });
});

// Hanya admin bisa tambah menu
router.post("/", authorize, (req, res) => {
  res.json({ message: "Menu baru berhasil ditambahkan" });
});

export default router;
