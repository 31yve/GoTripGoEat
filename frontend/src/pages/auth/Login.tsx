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
      const res = await fetch('http://localhost:3002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.token) localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Debug log untuk memastikan role
        console.log('Login data:', { role: data.user.role, user: data.user });

        const role = (data.user.role || '').toLowerCase().trim();
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'seller') {
          navigate('/dashboard/seller');
        } else if (role === 'student' || role === '') {
          navigate('/dashboard/student');
        } else {
          showToast({
            type: 'warning',
            title: 'Role Tidak Dikenali',
            description: `Role '${role}' tidak diketahui, diarahkan ke dashboard student.`
          });
          navigate('/dashboard/student');
        }

        showToast({
          type: 'success',
          title: 'Login Berhasil',
          description: `Selamat datang, ${data.user.name || role}!`
        });
      } else {
        showToast({
          type: 'error',
          title: 'Login gagal',
          description: data.error || 'Email atau password salah'
        });
      }
    } catch (err) {
      const errorMsg = err.name === 'TypeError' ? 'Tidak dapat terhubung ke server' : 'Terjadi kesalahan';
      console.error('Login error:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: errorMsg
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
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                name="username"
                type="email"
                required
                placeholder="Masukkan email"
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

            <div>
              <Button type="submit" className="w-full btn-ripple" size="lg">
                Masuk
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <button
              onClick={() => navigate('/register')}
              className="font-medium text-primary hover:text-primary/80"
            >
              Daftar sekarang
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;