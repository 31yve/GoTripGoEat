// src/store/authStore.ts
import { create } from "zustand";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  school: string;
  role: "student" | "admin" | "seller";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  username?: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Ambil data user dari backend (users.json)
      const res = await axios.get<User[]>("http://localhost:3002/api/users");
      const users = res.data;

      // Cari user yang cocok
      const found = users.find(
        (u) =>
          (u.email === email || u.username === email) && // bisa pakai email atau username
          (u.password ? u.password === password : true) && // validasi password kalau ada
          u.status === "active"
      );

      if (found) {
        set({ user: found, loading: false });
        return true;
      } else {
        set({ error: "Email atau password salah", loading: false });
        return false;
      }
    } catch (err) {
      set({ error: "Gagal terhubung ke server", loading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null });
  },
}));
