// backend/middleware/auth.js
export function authorize(roles = []) {
  return (req, res, next) => {
    const role = req.headers["x-role"]; // role dikirim di header request

    if (!role) {
      return res.status(403).json({ error: "Role tidak ditemukan" });
    }

    if (!roles.includes(role)) {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    next();
  };
}
