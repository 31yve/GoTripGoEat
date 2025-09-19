import express from "express";
import fs from "fs";
import { authorize } from "../middleware/auth.js";

const router = express.Router();
const file = "./backend/data/orders.json";

// Helper read & write
function readOrders() {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : [];
}
function writeOrders(orders) {
  fs.writeFileSync(file, JSON.stringify(orders, null, 2));
}

// 📍 GET orders
router.get("/", (req, res) => {
  const role = req.headers["x-role"];
  const userId = req.headers["x-user-id"];
  const orders = readOrders();

  if (role === "admin") {
    return res.json(orders); // admin bisa lihat semua
  }

  // siswa/guru hanya bisa lihat order milik sendiri
  const filtered = orders.filter(o => o.user_id === userId);
  res.json(filtered);
});

// 📍 CREATE new order (siswa/guru/admin)
router.post("/", authorize(["siswa", "guru", "admin"]), (req, res) => {
  const orders = readOrders();
  const { id, user_id, items, total } = req.body;

  if (!id || !user_id || !items || !total) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const newOrder = { id, user_id, items, total };
  orders.push(newOrder);
  writeOrders(orders);

  res.json({ message: "Order created", order: newOrder });
});

// 📍 UPDATE order (hanya admin atau pemilik order)
router.put("/:id", authorize(["siswa", "guru", "admin"]), (req, res) => {
  const orders = readOrders();
  const orderId = req.params.id;
  const role = req.headers["x-role"];
  const userId = req.headers["x-user-id"];

  const index = orders.findIndex(o => o.id == orderId);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  // hanya admin atau pemilik order boleh update
  if (role !== "admin" && orders[index].user_id !== userId) {
    return res.status(403).json({ error: "Forbidden: Not your order" });
  }

  orders[index] = { ...orders[index], ...req.body };
  writeOrders(orders);

  res.json({ message: "Order updated", order: orders[index] });
});

// 📍 DELETE order (hanya admin atau pemilik order)
router.delete("/:id", authorize(["siswa", "guru", "admin"]), (req, res) => {
  const orders = readOrders();
  const orderId = req.params.id;
  const role = req.headers["x-role"];
  const userId = req.headers["x-user-id"];

  const index = orders.findIndex(o => o.id == orderId);
  if (index === -1) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (role !== "admin" && orders[index].user_id !== userId) {
    return res.status(403).json({ error: "Forbidden: Not your order" });
  }

  const deleted = orders.splice(index, 1);
  writeOrders(orders);

  res.json({ message: "Order deleted", order: deleted[0] });
});

export default router;
