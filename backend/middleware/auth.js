// backend/middleware/auth.js

// authorize menerima array role
export function authorize(allowedRoles = []) {
  return (req, res, next) => {
    const role = req.headers?.["x-role"] || "user"; // role dikirim di header

    if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
      return next();
    }

    return res.status(403).json({ error: "Forbidden: You don't have access" });
  };
}

// cek minimal login (asal ada role)
export function requireLogin(req, res, next) {
  const role = req.headers?.["x-role"];
  if (!role) {
    return res.status(401).json({ error: "Unauthorized: Please login first" });
  }
  next();
}
