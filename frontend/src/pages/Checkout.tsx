import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToastProvider } from '@/components/ui/toast-provider';
import { ArrowLeft, MapPin, User, BookOpen } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    room: '',
    notes: ''
  });

  // Dummy cart data
  const cartItems = [
    { id: 1, name: 'Nasi Gudeg Special', price: 15000, quantity: 2 },
    { id: 2, name: 'Es Teh Manis', price: 3000, quantity: 1 }
  ];

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 2000;
  const grandTotal = cartTotal + deliveryFee;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.class || !formData.room) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field yang diperlukan'
      });
      return;
    }

    showToast({
      type: 'success',
      title: 'Pesanan Dikonfirmasi',
      description: 'Pesanan Anda sedang diproses!'
    });

    // Navigate to order tracking
    setTimeout(() => {
      navigate('/order-tracking/ORD12345');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard/student')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Checkout</h1>
              <p className="text-sm text-muted-foreground">Konfirmasi pesanan Anda</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Order Summary */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Biaya Antar</span>
                <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-primary">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Delivery Information */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Informasi Pengiriman</h3>
          
          <form onSubmit={handleConfirmOrder} className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Nama Lengkap</span>
              </Label>
              <Input
                id="name"
                required
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="class" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Kelas</span>
              </Label>
              <Input
                id="class"
                required
                placeholder="Contoh: XII RPL 1"
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="room" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Ruang Kelas</span>
              </Label>
              <Input
                id="room"
                required
                placeholder="Contoh: Gedung A Lantai 2"
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan khusus untuk penjual (opsional)"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="mt-1"
                rows={3}
              />
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Metode Pembayaran</h4>
              <Card className="p-3 bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">💰</span>
                  </div>
                  <div>
                    <p className="font-medium">Bayar di Tempat (COD)</p>
                    <p className="text-sm text-muted-foreground">Bayar saat makanan diantar</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-medium text-primary mb-2">⏰ Estimasi Pengiriman</h4>
              <p className="text-sm text-muted-foreground">
                Pesanan akan diantar dalam waktu 15-20 menit selama jam istirahat
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full btn-ripple"
              size="lg"
            >
              Konfirmasi Pesanan
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;