"use client";
import { useEffect, useState } from "react";

interface School {
  id: number;
  name: string;
  address: string;
  contact: string;
  students: number;
  canteens: number;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [newSchool, setNewSchool] = useState({ name: "", address: "", contact: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", address: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Dengan proxy, pakai relative path
  const API_BASE = "/";

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching schools...");
      const res = await fetch(`${API_BASE}schools`);
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log("✅ Schools fetched:", data.length, "items");
      setSchools(data);
    } catch (err: any) {
      console.error("❌ Fetch schools error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newSchool.name.trim()) {
      alert("❌ Nama sekolah wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("➕ Adding school:", newSchool);
      
      const res = await fetch(`${API_BASE}schools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchool),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      
      const newSchoolData = await res.json();
      console.log("✅ School added:", newSchoolData);
      alert("✅ Sekolah berhasil ditambahkan!");
      setNewSchool({ name: "", address: "", contact: "" });
      setShowAddModal(false);
      fetchSchools();
    } catch (err: any) {
      console.error("❌ Add school error:", err);
      alert(`❌ Gagal menambahkan: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (school: School) => {
    setEditingId(school.id);
    setEditForm({ 
      name: school.name, 
      address: school.address, 
      contact: school.contact 
    });
  };

  const handleSaveEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingId || !editForm.name.trim()) {
      alert("❌ Nama sekolah wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log("✏️ Updating school:", editForm, "ID:", editingId);
      
      const res = await fetch(`${API_BASE}schools/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      
      const updatedSchool = await res.json();
      console.log("✅ School updated:", updatedSchool);
      alert("✅ Sekolah berhasil diedit!");
      setEditingId(null);
      setEditForm({ name: "", address: "", contact: "" });
      fetchSchools();
    } catch (err: any) {
      console.error("❌ Edit school error:", err);
      alert(`❌ Gagal mengedit: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ Yakin ingin menghapus sekolah ini?")) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log("🗑️ Deleting school ID:", id);
      
      const res = await fetch(`${API_BASE}schools/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      
      const result = await res.json();
      console.log("✅ School deleted:", result);
      alert("✅ Sekolah berhasil dihapus!");
      fetchSchools();
    } catch (err: any) {
      console.error("❌ Delete school error:", err);
      alert(`❌ Gagal menghapus: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", address: "", contact: "" });
  };

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  if (loading && schools.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading data sekolah...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Sekolah</h1>
        <button 
          onClick={openAddModal}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
          disabled={loading}
        >
          <span>+</span>
          <span>Tambah</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <span>{error}</span>
            <button 
              onClick={fetchSchools} 
              className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Schools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schools.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">📚 Belum ada data sekolah</p>
            <p className="text-gray-400 mt-2">Klik "Tambah" untuk menambahkan sekolah pertama</p>
          </div>
        ) : (
          schools.map((school) => (
            <div 
              key={school.id} 
              className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
            >
              {/* Header with Actions */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-800 leading-tight">
                  {school.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(school)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    title="Edit Sekolah"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(school.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Hapus Sekolah"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Address */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{school.address}</p>
              
              {/* Contact */}
              <p className="text-sm text-gray-500 mb-4">{school.contact}</p>
              
              {/* Stats */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{school.students}</span> Siswa
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">{school.canteens}</span> Kantin
                </span>
              </div>

              {/* Edit Form (Conditional) */}
              {editingId === school.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <form onSubmit={handleSaveEdit} className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nama sekolah"
                      required
                    />
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Alamat"
                    />
                    <input
                      type="text"
                      value={editForm.contact}
                      onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Kontak"
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        disabled={loading || !editForm.name.trim()}
                      >
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Tambah Sekolah Baru</h2>
              <button
                onClick={closeAddModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Sekolah *
                </label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Contoh: SMK Negeri 1 Bandung"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat
                </label>
                <input
                  type="text"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Jl. Contoh No. 123, Kota"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kontak
                </label>
                <input
                  type="text"
                  value={newSchool.contact}
                  onChange={(e) => setNewSchool({ ...newSchool, contact: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="021-1234567"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={loading || !newSchool.name.trim()}
                >
                  {loading ? "Menyimpan..." : "Tambah Sekolah"}
                </button>
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  disabled={loading}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 