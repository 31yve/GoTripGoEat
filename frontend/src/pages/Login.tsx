import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToastProvider } from '@/components/ui/toast-provider';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Login handler - cek ke backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field'
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('user', JSON.stringify(data.user));

        // pakai lowercase supaya konsisten
        const role = (data.user.role || '').toLowerCase();

        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'seller') {
          navigate('/dashboard/seller');
        } else {
          navigate('/dashboard/student');
        }

        showToast({
          type: 'success',
          title: 'Login Berhasil',
          description: `Selamat datang, ${data.user.full_name || role}!`
        });
      } else {
        showToast({
          type: 'error',
          title: 'Login gagal',
          description: data.message || 'Username atau password salah'
        });
      }
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Tidak dapat terhubung ke server'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
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
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Atau{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            daftar akun baru
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1"
                placeholder="contoh: Ye"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
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
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Lupa password?
                </a>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full btn-ripple" size="lg">
                Masuk
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm text-muted-foreground">
              Belum punya akun?{' '}
              <button
                onClick={() => navigate('/register')}
                className="font-medium text-primary hover:text-primary/80"
              >
                Daftar sekarang
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
