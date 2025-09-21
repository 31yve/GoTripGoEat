"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [schoolYear, setSchoolYear] = useState("2025/2026");
  const [currency, setCurrency] = useState("IDR");

  const handleSave = () => {
    alert(`Settings disimpan!\nTahun Ajaran: ${schoolYear}\nMata Uang: ${currency}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pengaturan Sistem</h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block font-semibold">Tahun Ajaran</label>
          <input
            type="text"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Mata Uang</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="IDR">Rupiah (IDR)</option>
            <option value="USD">Dollar (USD)</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
