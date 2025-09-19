const db = require('../services/dbService');

exports.getUser = (req, res) => {
  const user = db.getById('users', req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: { ...user, password_hash: undefined }, message: 'User loaded' });
};

exports.updateUser = (req, res) => {
  const { name, email, phone_number, avatar_url, role, kelas, mata_pelajaran } = req.body;
  const updateData = { name, email, phone_number, avatar_url, role, updated_at: new Date().toISOString() };
  // Tambahan field khusus siswa/guru
  if (role === 'siswa' && kelas) updateData.kelas = kelas;
  if (role === 'guru' && mata_pelajaran) updateData.mata_pelajaran = mata_pelajaran;
  const user = db.update('users', req.params.id, updateData);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: { ...user, password_hash: undefined }, message: 'User updated' });
};

exports.getBalance = (req, res) => {
  const user = db.getById('users', req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: { balance: user.balance }, message: 'Balance loaded' });
};

exports.updateSettings = (req, res) => {
  const { dark_mode, language, notifications_enabled } = req.body;
  let settings = db.getAll('settings').find(s => s.user_id === req.params.id);
  if (!settings) {
    settings = { id: String(Date.now()), user_id: req.params.id, dark_mode, language, notifications_enabled };
    db.add('settings', settings);
  } else {
    settings = db.update('settings', settings.id, { dark_mode, language, notifications_enabled });
  }
  res.json({ success: true, data: settings, message: 'Settings updated' });
};
