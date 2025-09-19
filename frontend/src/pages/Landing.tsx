import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const schools = [
    {
      id: 'smk13',
      name: 'SMK 13 BANDUNG',
      location: 'Bandung, Jawa Barat',
      rating: 4.8,
      canteens: 5,
      image: '/api/placeholder/300/200'
    },
    {
      id: 'sma5',
      name: 'SMA 5 Jakarta',
      location: 'Jakarta Pusat',
      rating: 4.7,
      canteens: 3,
      image: '/api/placeholder/300/200'
    },
    {
      id: 'smp2',
      name: 'SMP 2 Bandung',
      location: 'Bandung, Jawa Barat',
      rating: 4.6,
      canteens: 4,
      image: '/api/placeholder/300/200'
    }
  ];

  const handleSchoolClick = (schoolId: string) => {
    setSelectedSchool(schoolId);
    navigate('/school/' + schoolId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">GT</span>
              </div>
              <span className="text-xl font-bold text-primary">GoTripGoEat</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
              <Button variant="ghost">Sekolah</Button>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </nav>
            
            <Button 
              className="md:hidden"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Pesan Makanan <span className="text-primary">Langsung ke Kelas</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Platform khusus sekolah untuk memesan makanan dari kantin dan diantar langsung ke kelasmu!
          </p>
          <Button 
            size="lg" 
            className="btn-ripple"
            onClick={() => navigate('/login')}
          >
            Mulai Pesan Sekarang
          </Button>
        </div>
      </section>

      {/* Popular Schools */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Sekolah Populer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Card 
                key={school.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleSchoolClick(school.id)}
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-bold text-lg">{school.name}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {school.location}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{school.rating}</span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {school.canteens} Kantin
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Kenapa GoTripGoEat?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Cepat & Tepat Waktu</h3>
              <p className="text-muted-foreground">Pesanan diantar langsung ke kelasmu dalam waktu istirahat</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Khusus Sekolah</h3>
              <p className="text-muted-foreground">Dirancang khusus untuk lingkungan sekolah yang aman</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Makanan Berkualitas</h3>
              <p className="text-muted-foreground">Hanya kantin terpercaya dengan makanan berkualitas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">GT</span>
            </div>
            <span className="font-bold text-primary">GoTripGoEat</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 GoTripGoEat. Platform pesan antar makanan khusus sekolah.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;