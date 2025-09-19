import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToastProvider } from '@/components/ui/toast-provider';
import { 
  Package, Plus, BarChart3, Settings, Clock,
  CheckCircle, XCircle, Eye, Edit, Trash2,
  DollarSign, Users, TrendingUp, Bell, User,
  Calendar, MapPin, Star, Phone, Mail, Store,
  ChevronDown, Award, MessageCircle, CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [activeTab, setActiveTab] = useState('orders');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Pesanan Baru', message: 'Ahmad Siswa memesan 2x Nasi Gudeg', time: '2 menit lalu', read: false },
    { id: 2, title: 'Pembayaran Diterima', message: 'Pembayaran untuk pesanan #ORD002 telah dikonfirmasi', time: '15 menit lalu', read: false },
    { id: 3, title: 'Review Baru', message: 'Siti Murid memberikan rating 5 bintang', time: '1 jam lalu', read: true }
  ]);

  const orders = [
    {
      id: 'ORD001',
      customerName: 'Ahmad Siswa',
      items: '2x Nasi Gudeg, 1x Es Teh',
      total: 33000,
      status: 'pending',
      time: '10:30',
      class: 'XII RPL 1'
    },
    {
      id: 'ORD002',
      customerName: 'Siti Murid',
      items: '1x Ayam Geprek',
      total: 12000,
      status: 'processing',
      time: '10:15',
      class: 'XI IPA 2'
    },
    {
      id: 'ORD003',
      customerName: 'Budi Pelajar',
      items: '3x Keripik Singkong',
      total: 15000,
      status: 'completed',
      time: '09:45',
      class: 'X TKJ 1'
    }
  ];

  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Bu Sari',
    email: 'sari@kantin.smk13.edu',
    phone: '081234567890',
    canteen: 'Kantin Bu Sari',
    address: 'SMK 13 Bandung'
  });
  const [showEditOperationalHours, setShowEditOperationalHours] = useState(false);
  const [showEditCanteenData, setShowEditCanteenData] = useState(false);
  const [operationalHours, setOperationalHours] = useState({
    weekdays: '07:00 - 14:00',
    saturday: '07:00 - 12:00'
  });
  const [canteenData, setCanteenData] = useState({
    name: 'Kantin Bu Sari',
    location: 'Gedung A, Lantai 1',
    phone: '0812-3456-7890'
  });
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Nasi Gudeg Special',
      price: 15000,
      category: 'Makanan Berat',
      stock: 20,
      sold: 45
    },
    {
      id: 2,
      name: 'Es Teh Manis',
      price: 3000,
      category: 'Minuman',
      stock: 50,
      sold: 120
    },
    {
      id: 3,
      name: 'Keripik Singkong',
      price: 5000,
      category: 'Snack',
      stock: 30,
      sold: 80
    }
  ]);

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: ''
    });
    setShowEditProduct(true);
  };

  const handleDeleteProduct = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(p => p.id !== selectedProduct.id));
      showToast({
        type: 'success',
        title: 'Produk Dihapus',
        description: `${selectedProduct.name} berhasil dihapus`
      });
    }
    setShowDeleteConfirm(false);
    setSelectedProduct(null);
  };

  const handleViewOrderDetail = (order: any) => {
    setSelectedOrderDetail(order);
    setShowOrderDetail(true);
  };

  const handleUpdateProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? {...p, name: newProduct.name, price: parseInt(newProduct.price), category: newProduct.category}
          : p
      ));
      showToast({
        type: 'success',
        title: 'Produk Diperbarui',
        description: `${newProduct.name} berhasil diperbarui`
      });
    }
    setShowEditProduct(false);
    setSelectedProduct(null);
    setNewProduct({ name: '', price: '', category: '', description: '' });
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

  const handleOrderAction = (orderId: string, action: 'accept' | 'reject' | 'complete') => {
    const actionText = {
      accept: 'diterima',
      reject: 'ditolak',
      complete: 'diselesaikan'
    };
    
    showToast({
      type: action === 'reject' ? 'warning' : 'success',
      title: 'Pesanan ' + actionText[action],
      description: `Pesanan ${orderId} berhasil ${actionText[action]}`
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field yang diperlukan'
      });
      return;
    }

    showToast({
      type: 'success',
      title: 'Produk Ditambahkan',
      description: `${newProduct.name} berhasil ditambahkan ke menu`
    });
    
    setShowAddProductModal(false);
    setNewProduct({ name: '', price: '', category: '', description: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Menunggu</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">Diproses</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Orders Tab
  if (activeTab === 'orders') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Pesanan Masuk</h1>
                <p className="text-sm text-muted-foreground">Kantin Bu Sari</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary/10 text-primary">
                  {orders.filter(o => o.status === 'pending').length} Baru
                </Badge>
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

        {/* Orders List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{order.id}</h3>
                  <p className="text-sm text-muted-foreground">{order.customerName} • {order.class}</p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="mb-3">
                <p className="text-sm">{order.items}</p>
                <p className="font-semibold text-primary mt-1">
                  Total: Rp {order.total.toLocaleString('id-ID')}
                </p>
              </div>

              {order.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleOrderAction(order.id, 'accept')}
                    className="flex-1 btn-ripple"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Terima
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleOrderAction(order.id, 'reject')}
                    className="flex-1 btn-ripple"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Tolak
                  </Button>
                </div>
              )}

              {order.status === 'processing' && (
                <Button
                  size="sm"
                  onClick={() => handleOrderAction(order.id, 'complete')}
                  className="w-full btn-ripple"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Selesai
                </Button>
              )}

              {order.status === 'completed' && (
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleViewOrderDetail(order)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Lihat Detail
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* Order Detail Modal */}
        <Modal isOpen={showOrderDetail} onClose={() => setShowOrderDetail(false)} title="Detail Pesanan">
          {selectedOrderDetail && (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="font-semibold">{selectedOrderDetail.id}</h3>
                <p className="text-sm text-muted-foreground">{selectedOrderDetail.customerName} • {selectedOrderDetail.class}</p>
                <p className="text-sm text-muted-foreground">{selectedOrderDetail.time}</p>
                <Badge className={
                  selectedOrderDetail.status === 'completed' ? 'bg-green-100 text-green-700' :
                  selectedOrderDetail.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }>
                  {selectedOrderDetail.status === 'completed' ? 'Selesai' : 
                   selectedOrderDetail.status === 'processing' ? 'Diproses' : 'Menunggu'}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Items:</h4>
                <div className="text-sm text-muted-foreground mb-2">
                  {selectedOrderDetail.items}
                </div>
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'orders', icon: Package, label: 'Pesanan' },
              { id: 'menu', icon: Plus, label: 'Menu' },
              { id: 'stats', icon: BarChart3, label: 'Statistik' },
              { id: 'settings', icon: Settings, label: 'Pengaturan' }
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
      </div>
    );
  }

  // Menu Tab
  if (activeTab === 'menu') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Menu Saya</h1>
                <p className="text-sm text-muted-foreground">{products.length} Produk • Rating 4.8 ⭐</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setShowAddProductModal(true)} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah
                </Button>
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
              </div>
            </div>
          </div>
        </header>

        {/* Products List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="font-semibold text-primary">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Stok: {product.stock}
                    </span>
                    <span className="text-sm text-green-600">
                      Terjual: {product.sold}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Product Modal */}
        <Modal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          title="Tambah Produk Baru"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Nama Produk</Label>
              <Input
                id="productName"
                placeholder="Masukkan nama produk"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="productPrice">Harga</Label>
              <Input
                id="productPrice"
                type="number"
                placeholder="Masukkan harga"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="productCategory">Kategori</Label>
              <Input
                id="productCategory"
                placeholder="Makanan Berat / Snack / Minuman"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="productDescription">Deskripsi</Label>
              <Textarea
                id="productDescription"
                placeholder="Deskripsi produk (opsional)"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddProductModal(false)}
              >
                Batal
              </Button>
              <Button className="flex-1 btn-ripple" onClick={handleAddProduct}>
                Tambah Produk
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          isOpen={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          title="Edit Produk"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="editProductName">Nama Produk</Label>
              <Input
                id="editProductName"
                placeholder="Masukkan nama produk"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editProductPrice">Harga</Label>
              <Input
                id="editProductPrice"
                type="number"
                placeholder="Masukkan harga"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="editProductCategory">Kategori</Label>
              <Input
                id="editProductCategory"
                placeholder="Makanan Berat / Snack / Minuman"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowEditProduct(false);
                  setSelectedProduct(null);
                  setNewProduct({ name: '', price: '', category: '', description: '' });
                }}
              >
                Batal
              </Button>
              <Button className="flex-1 btn-ripple" onClick={handleUpdateProduct}>
                Update Produk
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          title="Hapus Produk"
        >
          <div className="space-y-4">
            <p>Apakah Anda yakin ingin menghapus produk <strong>{selectedProduct?.name}</strong>?</p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={confirmDeleteProduct}
              >
                Hapus
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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'orders', icon: Package, label: 'Pesanan' },
              { id: 'menu', icon: Plus, label: 'Menu' },
              { id: 'stats', icon: BarChart3, label: 'Statistik' },
              { id: 'settings', icon: Settings, label: 'Pengaturan' }
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

  // Statistics Tab
  if (activeTab === 'stats') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Statistik Penjualan</h1>
                <p className="text-sm text-muted-foreground">Periode: Januari 2024</p>
              </div>
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
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penjualan Hari Ini</p>
                  <p className="font-bold text-lg">Rp 125.000</p>
                  <p className="text-xs text-green-600">+12% dari kemarin</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pesanan Hari Ini</p>
                  <p className="font-bold text-lg">24</p>
                  <p className="text-xs text-green-600">+5 dari kemarin</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-bold text-lg">4.8</p>
                  <p className="text-xs text-muted-foreground">127 review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pelanggan Baru</p>
                  <p className="font-bold text-lg">8</p>
                  <p className="text-xs text-green-600">Minggu ini</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Produk Terlaris</h3>
            <div className="space-y-3">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sold} terjual</p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Grafik Penjualan Mingguan</h3>
            <div className="h-32 bg-muted/30 rounded-lg flex items-center justify-center mb-4">
              <p className="text-muted-foreground">Grafik akan ditampilkan di sini</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Minggu Ini</span>
              <span className="font-semibold">Rp 875.000</span>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Performa Bulanan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Target Bulanan</span>
                <span className="text-sm font-medium">Rp 3.000.000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>65% tercapai</span>
                <span>Rp 1.950.000</span>
              </div>
            </div>
          </Card>
        </div>

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

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
          <div className="flex items-center justify-around py-2">
            {[
              { id: 'orders', icon: Package, label: 'Pesanan' },
              { id: 'menu', icon: Plus, label: 'Menu' },
              { id: 'stats', icon: BarChart3, label: 'Statistik' },
              { id: 'settings', icon: Settings, label: 'Pengaturan' }
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

  // Settings Tab
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Pengaturan</h1>
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
          </div>
        </div>
      </header>

      {/* Settings Content */}
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Bu Sari</h3>
              <p className="text-muted-foreground">sari@kantin.smk13.edu</p>
              <p className="text-sm text-muted-foreground">Penjual • SMK 13 Bandung</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => setShowEditProfile(true)}>
            Edit Profil
          </Button>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Jam Operasional</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Senin - Jumat: 07:00 - 14:00</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowEditOperationalHours(true)}>Edit</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Sabtu: 07:00 - 12:00</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowEditOperationalHours(true)}>Edit</Button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Data Kantin</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Store className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Nama Kantin</span>
              </div>
              <span className="text-sm font-medium">Kantin Bu Sari</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Lokasi</span>
              </div>
              <span className="text-sm font-medium">Gedung A, Lantai 1</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Telepon</span>
              </div>
              <span className="text-sm font-medium">0812-3456-7890</span>
            </div>
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowEditCanteenData(true)}>
              Edit Data Kantin
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Metode Pembayaran</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span>GoTripPay</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Aktif</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span>Transfer Bank</span>
              </div>
              <Badge className="bg-green-100 text-green-700">Aktif</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Pencapaian</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Penjual Terpercaya</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700">Gold</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-blue-500" />
                <span>Rating Tinggi</span>
              </div>
              <Badge className="bg-blue-100 text-blue-700">4.8 ⭐</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <span>Bantuan & Support</span>
            </div>
            <Button variant="ghost" size="sm">
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'orders', icon: Package, label: 'Pesanan' },
            { id: 'menu', icon: Plus, label: 'Menu' },
            { id: 'stats', icon: BarChart3, label: 'Statistik' },
            { id: 'settings', icon: Settings, label: 'Pengaturan' }
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

      {/* Edit Product Modal */}
      <Modal
        isOpen={showEditProduct}
        onClose={() => setShowEditProduct(false)}
        title="Edit Produk"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="editProductName">Nama Produk</Label>
            <Input
              id="editProductName"
              placeholder="Masukkan nama produk"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="editProductPrice">Harga</Label>
            <Input
              id="editProductPrice"
              type="number"
              placeholder="Masukkan harga"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="editProductCategory">Kategori</Label>
            <Input
              id="editProductCategory"
              placeholder="Makanan Berat / Snack / Minuman"
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            />
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowEditProduct(false);
                setSelectedProduct(null);
                setNewProduct({ name: '', price: '', category: '', description: '' });
              }}
            >
              Batal
            </Button>
            <Button className="flex-1 btn-ripple" onClick={handleUpdateProduct}>
              Update Produk
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Hapus Produk"
      >
        <div className="space-y-4">
          <p>Apakah Anda yakin ingin menghapus produk <strong>{selectedProduct?.name}</strong>?</p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={confirmDeleteProduct}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Order Detail Modal */}
      <Modal isOpen={showOrderDetail} onClose={() => setShowOrderDetail(false)} title="Detail Pesanan">
        {selectedOrderDetail && (
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-semibold">{selectedOrderDetail.id}</h3>
              <p className="text-sm text-muted-foreground">{selectedOrderDetail.customerName} • {selectedOrderDetail.class}</p>
              <p className="text-sm text-muted-foreground">{selectedOrderDetail.time}</p>
              <Badge className={
                selectedOrderDetail.status === 'completed' ? 'bg-green-100 text-green-700' :
                selectedOrderDetail.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }>
                {selectedOrderDetail.status === 'completed' ? 'Selesai' : 
                 selectedOrderDetail.status === 'processing' ? 'Diproses' : 'Menunggu'}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-2">Items:</h4>
              <div className="text-sm text-muted-foreground mb-2">
                {selectedOrderDetail.items}
              </div>
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
            <Label htmlFor="profileName">Nama Lengkap</Label>
            <Input
              id="profileName"
              defaultValue={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="profileEmail">Email</Label>
            <Input
              id="profileEmail"
              type="email"
              defaultValue={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="profilePhone">No. Telepon</Label>
            <Input
              id="profilePhone"
              defaultValue={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="profileCanteen">Nama Kantin</Label>
            <Input
              id="profileCanteen"
              defaultValue={profile.canteen}
              onChange={(e) => setProfile({...profile, canteen: e.target.value})}
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

      {/* Edit Operational Hours Modal */}
      <Modal isOpen={showEditOperationalHours} onClose={() => setShowEditOperationalHours(false)} title="Edit Jam Operasional">
        <div className="space-y-4">
          <div>
            <Label htmlFor="weekdaysHours">Senin - Jumat</Label>
            <Input
              id="weekdaysHours"
              placeholder="Contoh: 07:00 - 14:00"
              value={operationalHours.weekdays}
              onChange={(e) => setOperationalHours({...operationalHours, weekdays: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="saturdayHours">Sabtu</Label>
            <Input
              id="saturdayHours"
              placeholder="Contoh: 07:00 - 12:00"
              value={operationalHours.saturday}
              onChange={(e) => setOperationalHours({...operationalHours, saturday: e.target.value})}
            />
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowEditOperationalHours(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={() => {
              showToast({
                type: 'success',
                title: 'Jam Operasional Diperbarui',
                description: 'Jam operasional berhasil diperbarui'
              });
              setShowEditOperationalHours(false);
            }}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Canteen Data Modal */}
      <Modal isOpen={showEditCanteenData} onClose={() => setShowEditCanteenData(false)} title="Edit Data Kantin">
        <div className="space-y-4">
          <div>
            <Label htmlFor="canteenName">Nama Kantin</Label>
            <Input
              id="canteenName"
              value={canteenData.name}
              onChange={(e) => setCanteenData({...canteenData, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="canteenLocation">Lokasi</Label>
            <Input
              id="canteenLocation"
              placeholder="Contoh: Gedung A, Lantai 1"
              value={canteenData.location}
              onChange={(e) => setCanteenData({...canteenData, location: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="canteenPhone">Telepon</Label>
            <Input
              id="canteenPhone"
              placeholder="Contoh: 0812-3456-7890"
              value={canteenData.phone}
              onChange={(e) => setCanteenData({...canteenData, phone: e.target.value})}
            />
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowEditCanteenData(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={() => {
              showToast({
                type: 'success',
                title: 'Data Kantin Diperbarui',
                description: 'Data kantin berhasil diperbarui'
              });
              setShowEditCanteenData(false);
            }}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerDashboard;