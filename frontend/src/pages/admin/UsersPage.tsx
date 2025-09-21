"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3002/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Gagal fetch users:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="border p-3 rounded">
            <p><strong>{u.name}</strong> ({u.role})</p>
            <p>Email: {u.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
