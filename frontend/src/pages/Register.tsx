import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToastProvider } from '@/components/ui/toast-provider';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      showToast({ type: 'error', title: 'Error', description: 'Harap isi semua field' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast({ type: 'error', title: 'Error', description: 'Password dan konfirmasi password tidak cocok' });
      return;
    }

    if (formData.password.length < 6) {
      showToast({ type: 'error', title: 'Error', description: 'Password minimal 6 karakter' });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast({ type: "success", title: "Registrasi Berhasil", description: "Akun berhasil dibuat! Silakan login." });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showToast({ type: "error", title: "Error", description: data.error || "Gagal registrasi" });
      }
    } catch (err) {
      console.error("Register error:", err);
      showToast({ type: "error", title: "Error", description: "Gagal koneksi ke server" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-4 self-start"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

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
          Sudah punya akun?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            masuk di sini
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nama@sekolah.edu"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground"/> : <Eye className="h-4 w-4 text-muted-foreground"/>}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="mt-1 relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan password lagi"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground"/> : <Eye className="h-4 w-4 text-muted-foreground"/>}
                </button>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full btn-ripple" size="lg">
                Daftar
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Dengan mendaftar, Anda menyetujui{' '}
            <a href="#" className="font-medium text-primary hover:text-primary/80">Syarat & Ketentuan</a> dan{' '}
            <a href="#" className="font-medium text-primary hover:text-primary/80">Kebijakan Privasi</a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
