"use client";
import { useEffect, useState } from "react";

export default function OrderTracking() {
  const [orders, setOrders] = useState<any[]>([]);
  const studentId = 1; // contoh siswa login

  useEffect(() => {
    fetch("http://localhost:3002/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.filter((o: any) => o.userId === studentId));
      })
      .catch((err) => console.error("Gagal fetch orders:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lacak Pesanan</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border p-4 rounded shadow">
            <p><strong>Pesanan #{o.id}</strong></p>
            <p>Menu: {o.items.map((i: any) => i.name).join(", ")}</p>
            <p>Total: Rp {o.total}</p>
            <p>Status: <span className="font-semibold">{o.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
