"use client";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3002/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Gagal fetch orders:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Pesanan</h1>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o.id} className="border p-3 rounded">
            <p><strong>Pesanan #{o.id}</strong></p>
            <p>User: {o.userId}</p>
            <p>Menu: {o.items.map((i: any) => i.name).join(", ")}</p>
            <p>Total: Rp {o.total}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
