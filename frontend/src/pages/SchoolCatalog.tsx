import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Plus, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToastProvider } from '@/components/ui/toast-provider';

const SchoolCatalog = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams();
  const { showToast } = useToastProvider();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);

  const schoolNames = {
    smk13: 'SMK 13 BANDUNG',
    sma5: 'SMA 5 Jakarta',
    smp2: 'SMP 2 Bandung'
  };

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'snack', name: 'Snack' },
    { id: 'minuman', name: 'Minuman' },
    { id: 'makanan', name: 'Makanan Berat' }
  ];

  const foods = [
    {
      id: 1,
      name: 'Nasi Gudeg Special',
      price: 15000,
      category: 'makanan',
      rating: 4.8,
      image: '/api/placeholder/200/150',
      seller: 'Kantin Bu Sari',
      description: 'Gudeg khas Yogya dengan ayam dan telur'
    },
    {
      id: 2,
      name: 'Es Teh Manis',
      price: 3000,
      category: 'minuman',
      rating: 4.5,
      image: '/api/placeholder/200/150',
      seller: 'Kantin Pak Budi',
      description: 'Es teh segar dengan gula aren'
    },
    {
      id: 3,
      name: 'Keripik Singkong',
      price: 5000,
      category: 'snack',
      rating: 4.6,
      image: '/api/placeholder/200/150',
      seller: 'Kantin Bu Ani',
      description: 'Keripik singkong renyah dan gurih'
    },
    {
      id: 4,
      name: 'Ayam Geprek',
      price: 12000,
      category: 'makanan',
      rating: 4.9,
      image: '/api/placeholder/200/150',
      seller: 'Kantin Pak Joko',
      description: 'Ayam geprek pedas dengan sambal matah'
    },
    {
      id: 5,
      name: 'Jus Jeruk Segar',
      price: 8000,
      category: 'minuman',
      rating: 4.7,
      image: '/api/placeholder/200/150',
      seller: 'Kantin Bu Rita',
      description: 'Jus jeruk segar tanpa pengawet'
    },
    {
      id: 6,
      name: 'Pisang Goreng',
      price: 4000,
      category: 'snack',
      rating: 4.4,
      image: '/api/placeholder/200/150',
      seller: 'Kantin Bu Sari',
      description: 'Pisang goreng renyah dengan tepung crispy'
    }
  ];

  const filteredFoods = selectedCategory === 'all' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  const handleAddToCart = (food: any) => {
    setCartCount(prev => prev + 1);
    showToast({
      type: 'success',
      title: 'Ditambahkan ke Keranjang',
      description: `${food.name} berhasil ditambahkan`
    });
    
    // Add fly-to-cart animation
    const event = new CustomEvent('flyToCart');
    document.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">{schoolNames[schoolId as keyof typeof schoolNames]}</h1>
                <p className="text-sm text-muted-foreground">Katalog Makanan & Minuman</p>
              </div>
            </div>
            
            <Button onClick={() => navigate('/login')} size="sm">
              Login untuk Pesan
            </Button>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Cari makanan atau minuman..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 pb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap btn-ripple"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-square bg-muted relative">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    ⭐ {food.rating}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{food.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">{food.seller}</p>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{food.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    Rp {food.price.toLocaleString('id-ID')}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(food)}
                    className="btn-ripple"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Tambah
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative"
          onClick={() => navigate('/login')}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Keranjang
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground min-w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SchoolCatalog;