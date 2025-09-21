import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToastProvider } from "@/components/ui/toast-provider";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "student", // default student
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        if (data.token) localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        const role = (data.user.role || "").toLowerCase();

        if (role === "admin") {
          navigate("/dashboard/admin");
        } else if (role === "seller" || role === "penjual" || role === "teacher") {
          navigate("/dashboard/seller");
        } else {
          navigate("/dashboard/student");
        }

        showToast({
          type: "success",
          title: "Registrasi Berhasil",
          description: `Selamat datang, ${data.user.full_name || role}!`,
        });
      } else {
        showToast({
          type: "error",
          title: "Registrasi gagal",
          description: data.message || "Terjadi kesalahan",
        });
      }
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Error",
        description: "Tidak dapat terhubung ke server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        <h2 className="text-center text-3xl font-extrabold text-foreground">
          Daftar Akun Baru
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                type="text"
                required
                placeholder="Nama lengkap"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Nomor HP</Label>
              <Input
                id="phone"
                type="text"
                placeholder="08xxxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="role">Pilih Role</Label>
              <select
                id="role"
                className="w-full border rounded-md px-3 py-2 mt-1"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Siswa</option>
                <option value="seller">Penjual</option>
                <option value="teacher">Guru</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full btn-ripple"
                size="lg"
                disabled={loading}
              >
                {loading ? "Mendaftarkan..." : "Daftar"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-primary hover:text-primary/80"
            >
              Masuk
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
