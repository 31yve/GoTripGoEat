import jwt from "jsonwebtoken";

const SECRET_KEY = "GTGOO1";

// Middleware untuk verifikasi JWT
export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  // Format: Bearer <token>
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token tidak valid" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // simpan user { id, role } di request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak sah atau kadaluarsa" });
  }
}

// Middleware opsional: cek role tertentu (admin/seller/student)
export function roleMiddleware(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }
    next();
  };
}
