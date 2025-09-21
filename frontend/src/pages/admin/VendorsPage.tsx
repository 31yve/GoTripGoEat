"use client";
import { useEffect, useState } from "react";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3002/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Gagal fetch vendors:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Vendor Kantin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendors.map((v) => (
          <div key={v.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{v.name}</h2>
            <p>Email: {v.email}</p>
            <p>Telepon: {v.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
