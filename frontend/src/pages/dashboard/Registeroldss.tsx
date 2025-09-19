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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    role: "student", // default student
    phone: "",       // tambahin biar konsisten dengan backend
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      showToast({
        type: "error",
        title: "Error",
        description: "Semua field wajib diisi",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // simpan user ke localStorage (opsional)
        localStorage.setItem("user", JSON.stringify(data.user));

        // redirect sesuai role
        const role = data.user.role;
        if (role === "admin") {
          navigate("/dashboard/admin");
        } else if (role === "seller") {
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
          description: data.error || "Terjadi kesalahan saat registrasi",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "Error",
        description: "Tidak dapat terhubung ke server",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        {/* Logo */}
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">GT</span>
          </div>
          <span className="text-2xl font-bold text-primary">GoTripGoEat</span>
        </div>

        <h2 className="text-center text-3xl font-extrabold text-foreground">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            masuk sekarang
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1"
                placeholder="username123"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                placeholder="nama@sekolah.edu"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                className="mt-1"
                placeholder="Nama Lengkap"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1"
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
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
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                name="role"
                className="mt-1 w-full border rounded-md px-3 py-2"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <Button type="submit" className="w-full btn-ripple" size="lg">
                Daftar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
