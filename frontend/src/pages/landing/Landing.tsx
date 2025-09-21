import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Loader2, 
  School, 
  Users, 
  Store, 
  TrendingUp, 
  Shield, 
  Award,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Landing = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3002/api/schools', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setSchools(data);
      } else {
        console.warn('Schools data is not an array:', data);
        setSchools([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Failed to fetch schools:', err);
      setError(`Gagal terhubung ke server: ${errorMessage}`);
      setSchools([]); // Fallback ke array kosong
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto" />
          <p className="text-muted-foreground">Memuat data sekolah...</p>
        </div>
      </div>
    );
  }

  // Error state with retry and offline fallback
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-destructive">Gagal Memuat Data</h2>
          <p className="text-muted-foreground">
            {error}. Pastikan server berjalan di <a href="http://localhost:3002/api/health" target="_blank" rel="noopener noreferrer" className="underline text-primary">http://localhost:3002</a>.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full sm:w-auto"
            >
              Muat Ulang
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchSchools}
              className="w-full sm:w-auto"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Selamat Datang di 
            <span className="text-primary block">Platform Kantin Sekolah</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hubungkan siswa dan penjual kantin dengan mudah. Nikmati pengalaman 
            belanja makanan yang cepat, aman, dan praktis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Mulai Sekarang
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Schools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sekolah Terdaftar</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Pilih sekolah Anda untuk mulai berbelanja atau mendaftar sebagai penjual
            </p>
          </div>

          {schools.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum Ada Sekolah Terdaftar</h3>
              <p className="text-muted-foreground mb-6">
                Silakan hubungi tim support untuk mendaftarkan sekolah Anda.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school) => (
                <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <School className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Aktif</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{school.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {school.address || 'Alamat tidak tersedia'}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          <Users className="w-4 h-4 inline mr-1" />
                          {school.students || 0} Siswa
                        </span>
                        <span>
                          <Store className="w-4 h-4 inline mr-1" />
                          {school.canteens || 0} Kantin
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/school/${school.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Lihat Kantin
                        </Button>
                      </Link>
                      <Button className="flex-1" asChild>
                        <Link to="/register">
                          Bergabung
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Mengapa Memilih Kami?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Platform yang dirancang khusus untuk kebutuhan kantin sekolah
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Pemesanan Cepat</h3>
              <p className="text-muted-foreground">
                Pesan makanan favorit Anda dalam hitungan detik tanpa antri panjang
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Aman & Terpercaya</h3>
              <p className="text-muted-foreground">
                Transaksi aman dengan sistem pembayaran terintegrasi dan terverifikasi
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Kualitas Terjamin</h3>
              <p className="text-muted-foreground">
                Penjual terverifikasi dan makanan segar langsung dari kantin sekolah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Bergabunglah dengan ribuan siswa dan penjual yang sudah menggunakan platform kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Masuk Sekarang
              </Button>
            </Link>
            <a href="https://wa.me/6285126080236" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <HelpCircle className="w-4 h-4 mr-2" />
                Butuh Bantuan?
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
