import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useToastProvider } from '@/components/ui/toast-provider';
import { 
  Search, Plus, ShoppingCart, Bell, User, 
  Home, Package, Heart, Settings, MapPin,
  Star, Clock, ChevronDown, X, CheckCircle,
  CreditCard, Award, Gift, MessageCircle, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [selectedSchool, setSelectedSchool] = useState('SMK 13 BANDUNG');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSchoolSelector, setShowSchoolSelector] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ahmad Siswa',
    email: 'ahmad@smk13.edu',
    class: 'XII RPL 1',
    phone: '081234567890'
  });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pesanan Diterima', message: 'Pesanan Anda #ORD001 telah diterima penjual', time: '2 menit lalu', read: false },
    { id: 2, title: 'Promo Spesial', message: 'Diskon 20% untuk semua minuman hari ini!', time: '1 jam lalu', read: false },
    { id: 3, title: 'Pesanan Selesai', message: 'Pesanan #ORD002 telah selesai diantar', time: '3 jam lalu', read: true }
  ]);
  const [favorites, setFavorites] = useState([1, 3]);
  const [orders, setOrders] = useState([
    { id: 'ORD001', items: [{ name: 'Nasi Gudeg', quantity: 2, price: 15000 }, { name: 'Es Teh', quantity: 1, price: 3000 }], total: 33000, status: 'Selesai', date: '15/01/2024', time: '10:30', seller: 'Kantin Bu Sari' },
    { id: 'ORD002', items: [{ name: 'Ayam Geprek', quantity: 1, price: 12000 }], total: 12000, status: 'Diantar', date: '15/01/2024', time: '11:15', seller: 'Kantin Pak Budi' },
    { id: 'ORD003', items: [{ name: 'Keripik Singkong', quantity: 3, price: 5000 }], total: 15000, status: 'Diproses', date: '15/01/2024', time: '11:45', seller: 'Kantin Bu Ani' }
  ]);

  const schools = [
    { id: 1, name: 'SMK 13 BANDUNG' },
    { id: 2, name: 'SMA 5 Jakarta' },
    { id: 3, name: 'SMP 2 Bandung' }
  ];

  const handleViewOrderDetail = (order: any) => {
    setSelectedOrderDetail(order);
    setShowOrderDetail(true);
  };

  const handleReorder = (order: any) => {
    order.items.forEach((item: any) => {
      const food = foods.find(f => f.name === item.name);
      if (food) {
        for (let i = 0; i < item.quantity; i++) {
          handleAddToCart(food);
        }
      }
    });
    showToast({
      type: 'success',
      title: 'Berhasil Ditambahkan',
      description: 'Item pesanan telah ditambahkan ke keranjang'
    });
  };

  const handleEditProfile = (updatedProfile: any) => {
    setProfile(updatedProfile);
    setShowEditProfile(false);
    showToast({
      type: 'success',
      title: 'Profil Diperbarui',
      description: 'Data profil berhasil diperbarui'
    });
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
      seller: 'Kantin Bu Sari'
    },
    {
      id: 2,
      name: 'Es Teh Manis',
      price: 3000,
      category: 'minuman',
      rating: 4.5,
      seller: 'Kantin Pak Budi'
    },
    {
      id: 3,
      name: 'Keripik Singkong',
      price: 5000,
      category: 'snack',
      rating: 4.6,
      seller: 'Kantin Bu Ani'
    }
  ];

  const filteredFoods = selectedCategory === 'all' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  const handleAddToCart = (food: any) => {
    const existingItem = cartItems.find(item => item.id === food.id);
    if (existingItem) {
      setCartItems(prev => prev.map(item => 
        item.id === food.id 
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
    } else {
      setCartItems(prev => [...prev, {...food, quantity: 1}]);
    }
    
    showToast({
      type: 'success',
      title: 'Ditambahkan ke Keranjang',
      description: `${food.name} berhasil ditambahkan`
    });
  };

  const handleCheckout = () => {
    setShowCart(false);
    navigate('/checkout');
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (activeTab === 'orders') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold">Riwayat Pesanan</h1>
          </div>
        </header>

        {/* Orders List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.date}, {order.time}</p>
                  <p className="text-sm text-muted-foreground">{order.seller}</p>
                </div>
                <Badge className={
                  order.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                  order.status === 'Diantar' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'Diproses' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }>
                  {order.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {order.items.map((item: any) => `${item.quantity}x ${item.name}`).join(', ')}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total: Rp {order.total.toLocaleString('id-ID')}</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewOrderDetail(order)}>
                    Lihat Detail
                  </Button>
                  {order.status === 'Selesai' && (
                    <Button size="sm" onClick={() => handleReorder(order)}>
                      Pesan Lagi
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Detail Modal */}
        <Modal isOpen={showOrderDetail} onClose={() => setShowOrderDetail(false)} title="Detail Pesanan">
          {selectedOrderDetail && (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-semibold">{selectedOrderDetail.id}</h3>
                <p className="text-sm text-muted-foreground">{selectedOrderDetail.date}, {selectedOrderDetail.time}</p>
                <p className="text-sm text-muted-foreground">{selectedOrderDetail.seller}</p>
                <Badge className={
                  selectedOrderDetail.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                  selectedOrderDetail.status === 'Diantar' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }>
                  {selectedOrderDetail.status}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Items:</h4>
                {selectedOrderDetail.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground"> x{item.quantity}</span>
                    </div>
                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary">Rp {selectedOrderDetail.total.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'orders', icon: Package, label: 'Pesanan' },
              { id: 'favorites', icon: Heart, label: 'Favorit' },
              { id: 'profile', icon: User, label: 'Profil' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'favorites') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold">Makanan Favorit</h1>
          </div>
        </header>

        {/* Favorites List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {foods.filter(food => favorites.includes(food.id)).map(food => (
            <Card key={food.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{food.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setFavorites(favorites.filter(f => f !== food.id))}
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{food.seller}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm">{food.rating}</span>
                  </div>
                  <div className="font-semibold text-primary mt-2">
                    Rp {food.price.toLocaleString('id-ID')}
                  </div>
                </div>
                <Button size="sm" onClick={() => handleAddToCart(food)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
              </div>
            </Card>
          ))}
          {favorites.length === 0 && (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada makanan favorit</p>
              <Button variant="outline" onClick={() => setActiveTab('home')} className="mt-2">
                Jelajahi Menu
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'orders', icon: Package, label: 'Pesanan' },
              { id: 'favorites', icon: Heart, label: 'Favorit' },
              { id: 'profile', icon: User, label: 'Profil' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'profile') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold">Profil Saya</h1>
          </div>
        </header>

        {/* Profile Content */}
        <div className="p-4">
          <Card className="p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.email}</p>
                <p className="text-sm text-muted-foreground">Kelas {profile.class}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setShowEditProfile(true)}>
              Edit Profil
            </Button>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pesanan</p>
                  <p className="font-bold text-lg">{orders.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">GoTripPay</p>
                  <p className="font-bold text-lg">Rp 45.000</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span>Metode Pembayaran</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowPaymentMethods(true)}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>Alamat Pengiriman</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowAddresses(true)}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <span>Program Loyalitas</span>
                </div>
                <Badge className="bg-primary/10 text-primary">Bronze</Badge>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Gift className="w-5 h-5 text-muted-foreground" />
                  <span>Kupon & Promo</span>
                </div>
                <Badge variant="outline">2 Tersedia</Badge>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Bantuan & Support</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSupport(true)}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profil">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                defaultValue={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="class">Kelas</Label>
              <Input
                id="class"
                defaultValue={profile.class}
                onChange={(e) => setProfile({...profile, class: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">No. Telepon</Label>
              <Input
                id="phone"
                defaultValue={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditProfile(false)}>
                Batal
              </Button>
              <Button className="flex-1" onClick={() => handleEditProfile(profile)}>
                Simpan
              </Button>
            </div>
          </div>
        </Modal>

        {/* Payment Methods Modal */}
        <Modal isOpen={showPaymentMethods} onClose={() => setShowPaymentMethods(false)} title="Metode Pembayaran">
          <div className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">GoTripPay</p>
                  <p className="text-sm text-muted-foreground">Saldo: Rp 45.000</p>
                </div>
              </div>
            </Card>
            <Button variant="outline" className="w-full">
              + Tambah Metode Pembayaran
            </Button>
          </div>
        </Modal>

        {/* Addresses Modal */}
        <Modal isOpen={showAddresses} onClose={() => setShowAddresses(false)} title="Alamat Pengiriman">
          <div className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Kelas XII RPL 1</p>
                  <p className="text-sm text-muted-foreground">SMK 13 Bandung, Jl. Raya Bandung No. 123</p>
                </div>
              </div>
            </Card>
            <Button variant="outline" className="w-full">
              + Tambah Alamat Baru
            </Button>
          </div>
        </Modal>

        {/* Support Modal */}
        <Modal isOpen={showSupport} onClose={() => setShowSupport(false)} title="Bantuan & Support">
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-2">FAQ</h4>
              <div className="space-y-2 text-sm">
                <p>• Bagaimana cara memesan makanan?</p>
                <p>• Bagaimana cara mengisi saldo GoTripPay?</p>
                <p>• Bagaimana cara melacak pesanan?</p>
              </div>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium mb-2">Hubungi Kami</h4>
              <div className="space-y-2 text-sm">
                <p>📧 support@gotrip.com</p>
                <p>📞 0800-1234-5678</p>
                <p>💬 Live Chat (09:00-17:00)</p>
              </div>
            </Card>
          </div>
        </Modal>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'orders', icon: Package, label: 'Pesanan' },
              { id: 'favorites', icon: Heart, label: 'Favorit' },
              { id: 'profile', icon: User, label: 'Profil' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 ${
                  activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="flex items-center space-x-2" onClick={() => setShowSchoolSelector(true)}>
                <span className="text-sm font-medium">{selectedSchool}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setActiveTab('profile')}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Promo Banner */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground p-6">
          <h2 className="text-lg font-bold mb-2">Promo Hari Ini! 🎉</h2>
          <p className="text-sm opacity-90">Diskon 20% untuk pembelian di atas Rp 25.000</p>
        </Card>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Cari makanan favorit..." className="pl-10" />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
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

      {/* Food Recommendations */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-4">Rekomendasi Untukmu</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFoods.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <Badge className="absolute top-2 right-2 text-xs">
                  ⭐ {food.rating}
                </Badge>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-1">{food.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{food.seller}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">
                    Rp {food.price.toLocaleString('id-ID')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (favorites.includes(food.id)) {
                          setFavorites(favorites.filter(f => f !== food.id));
                          showToast({ type: 'info', title: 'Dihapus dari favorit', description: food.name });
                        } else {
                          setFavorites([...favorites, food.id]);
                          showToast({ type: 'success', title: 'Ditambahkan ke favorit', description: food.name });
                        }
                      }}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(food.id) ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
                    </Button>
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
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button
            onClick={() => setShowCart(true)}
            className="rounded-full shadow-lg relative"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Keranjang
            <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground min-w-6 h-6 rounded-full">
              {cartCount}
            </Badge>
          </Button>
        </div>
      )}

      {/* Cart Modal */}
      <Modal isOpen={showCart} onClose={() => setShowCart(false)} title="Keranjang Belanja">
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium">
                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-primary">Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <Button 
              className="w-full mt-4 btn-ripple" 
              size="lg"
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notifikasi">
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className={`p-3 rounded-lg border ${!notif.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-sm">{notif.title}</h4>
                <span className="text-xs text-muted-foreground">{notif.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{notif.message}</p>
              {!notif.read && (
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setNotifications(notifications.map(n => 
                        n.id === notif.id ? {...n, read: true} : n
                      ));
                    }}
                  >
                    Tandai Dibaca
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setNotifications(notifications.map(n => ({...n, read: true})));
              showToast({ type: 'success', title: 'Semua notifikasi ditandai sebagai dibaca', description: '' });
            }}
          >
            Tandai Semua Dibaca
          </Button>
        </div>
      </Modal>

      {/* School Selector Modal */}
      <Modal isOpen={showSchoolSelector} onClose={() => setShowSchoolSelector(false)} title="Pilih Sekolah">
        <div className="space-y-3">
          {schools.map((school) => (
            <Button
              key={school.id}
              variant={selectedSchool === school.name ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedSchool(school.name);
                setShowSchoolSelector(false);
                showToast({
                  type: 'success',
                  title: 'Sekolah Dipilih',
                  description: `Berganti ke ${school.name}`
                });
              }}
            >
              {school.name}
            </Button>
          ))}
        </div>
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={showOrderDetail} onClose={() => setShowOrderDetail(false)} title="Detail Pesanan">
        {selectedOrderDetail && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold">{selectedOrderDetail.id}</h3>
              <p className="text-sm text-muted-foreground">{selectedOrderDetail.date}, {selectedOrderDetail.time}</p>
              <p className="text-sm text-muted-foreground">{selectedOrderDetail.seller}</p>
              <Badge className={
                selectedOrderDetail.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                selectedOrderDetail.status === 'Diantar' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }>
                {selectedOrderDetail.status}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Items:</h4>
              {selectedOrderDetail.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground"> x{item.quantity}</span>
                  </div>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary">Rp {selectedOrderDetail.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} title="Edit Profil">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              defaultValue={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="class">Kelas</Label>
            <Input
              id="class"
              defaultValue={profile.class}
              onChange={(e) => setProfile({...profile, class: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="phone">No. Telepon</Label>
            <Input
              id="phone"
              defaultValue={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowEditProfile(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={() => handleEditProfile(profile)}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal isOpen={showPaymentMethods} onClose={() => setShowPaymentMethods(false)} title="Metode Pembayaran">
        <div className="space-y-3">
          <Card className="p-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">GoTripPay</p>
                <p className="text-sm text-muted-foreground">Saldo: Rp 45.000</p>
              </div>
            </div>
          </Card>
          <Button variant="outline" className="w-full">
            + Tambah Metode Pembayaran
          </Button>
        </div>
      </Modal>

      {/* Addresses Modal */}
      <Modal isOpen={showAddresses} onClose={() => setShowAddresses(false)} title="Alamat Pengiriman">
        <div className="space-y-3">
          <Card className="p-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Kelas XII RPL 1</p>
                <p className="text-sm text-muted-foreground">SMK 13 Bandung, Jl. Raya Bandung No. 123</p>
              </div>
            </div>
          </Card>
          <Button variant="outline" className="w-full">
            + Tambah Alamat Baru
          </Button>
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal isOpen={showSupport} onClose={() => setShowSupport(false)} title="Bantuan & Support">
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2">FAQ</h4>
            <div className="space-y-2 text-sm">
              <p>• Bagaimana cara memesan makanan?</p>
              <p>• Bagaimana cara mengisi saldo GoTripPay?</p>
              <p>• Bagaimana cara melacak pesanan?</p>
            </div>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">Hubungi Kami</h4>
            <div className="space-y-2 text-sm">
              <p>📧 support@gotrip.com</p>
              <p>📞 0800-1234-5678</p>
              <p>💬 Live Chat (09:00-17:00)</p>
            </div>
          </Card>
        </div>
      </Modal>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'orders', icon: Package, label: 'Pesanan' },
            { id: 'favorites', icon: Heart, label: 'Favorit' },
            { id: 'profile', icon: User, label: 'Profil' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;