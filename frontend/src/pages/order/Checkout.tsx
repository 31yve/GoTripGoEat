"use client";
import { useEffect, useState } from "react";

export default function Checkout() {
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3002/menu")
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch((err) => console.error("Gagal fetch menu:", err));
  }, []);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  const handleCheckout = async () => {
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    const order = {
      id: Date.now(),
      userId: 1, // contoh siswa login
      vendorId: 101, // contoh vendor
      items: cart,
      total,
      status: "pending",
    };

    try {
      await fetch("http://localhost:3002/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      alert("Pesanan berhasil dibuat!");
      setCart([]);
    } catch (err) {
      console.error("Gagal membuat pesanan:", err);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Menu */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Pilih Menu</h1>
        <div className="space-y-2">
          {menu.map((m) => (
            <div key={m.id} className="flex justify-between border p-3 rounded">
              <span>{m.name} - Rp {m.price}</span>
              <button
                onClick={() => addToCart(m)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Tambah
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Keranjang */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        <ul className="space-y-2 mb-4">
          {cart.map((c, idx) => (
            <li key={idx} className="border p-2 rounded">
              {c.name} - Rp {c.price}
            </li>
          ))}
        </ul>
        {cart.length > 0 && (
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}
