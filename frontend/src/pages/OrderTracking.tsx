import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Truck, Package } from 'lucide-react';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  // Auto progress the order status for demo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 3000); // Progress every 3 seconds

    return () => clearInterval(timer);
  }, []);

  const orderData = {
    id: orderId || 'ORD12345',
    customerName: 'Ahmad Siswa',
    items: [
      { name: 'Nasi Gudeg Special', quantity: 2, price: 15000 },
      { name: 'Es Teh Manis', quantity: 1, price: 3000 }
    ],
    total: 35000,
    deliveryAddress: 'XII RPL 1, Gedung A Lantai 2',
    estimatedTime: '15-20 menit',
    seller: 'Kantin Bu Sari'
  };

  const steps = [
    {
      id: 1,
      title: 'Pesanan Diterima',
      description: 'Pesanan Anda telah diterima penjual',
      icon: CheckCircle,
      time: '10:30'
    },
    {
      id: 2,
      title: 'Sedang Diproses',
      description: 'Makanan sedang disiapkan',
      icon: Clock,
      time: '10:32'
    },
    {
      id: 3,
      title: 'Dalam Perjalanan',
      description: 'Pesanan dalam perjalanan ke kelas',
      icon: Truck,
      time: '10:45'
    },
    {
      id: 4,
      title: 'Selesai',
      description: 'Pesanan telah diantar',
      icon: Package,
      time: '10:50'
    }
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
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
              <h1 className="font-bold text-lg">Lacak Pesanan</h1>
              <p className="text-sm text-muted-foreground">{orderData.id}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Order Status Card */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              currentStep === 4 ? 'bg-green-100' : 'bg-primary/10'
            }`}>
              {currentStep === 4 ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Clock className="w-8 h-8 text-primary" />
              )}
            </div>
            <h2 className="text-xl font-bold mb-2">
              {currentStep === 4 ? 'Pesanan Selesai!' : steps[currentStep - 1]?.title}
            </h2>
            <p className="text-muted-foreground">
              {currentStep === 4 
                ? 'Terima kasih telah memesan di GoTripGoEat!'
                : steps[currentStep - 1]?.description
              }
            </p>
            {currentStep < 4 && (
              <Badge className="mt-3 bg-primary/10 text-primary">
                Estimasi: {orderData.estimatedTime}
              </Badge>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const StepIcon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center space-x-4">
                  {/* Step Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : status === 'current'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${
                        status === 'pending' ? 'text-muted-foreground' : ''
                      }`}>
                        {step.title}
                      </h3>
                      {status !== 'pending' && (
                        <span className="text-sm text-muted-foreground">
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      status === 'pending' ? 'text-muted-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`absolute left-[2.5rem] w-0.5 h-6 mt-10 ${
                      status === 'completed' ? 'bg-green-200' : 'bg-muted'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Detail Pesanan</h3>
          
          {/* Items */}
          <div className="space-y-2 mb-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-semibold">
              <span>Total Pembayaran</span>
              <span className="text-primary">Rp {orderData.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
          
          {/* Delivery Info */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Informasi Pengiriman</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Alamat:</strong> {orderData.deliveryAddress}</p>
              <p><strong>Penjual:</strong> {orderData.seller}</p>
              <p><strong>Metode Bayar:</strong> Bayar di Tempat (COD)</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {currentStep === 4 ? (
            <Button 
              onClick={() => navigate('/dashboard/student')}
              className="w-full btn-ripple"
              size="lg"
            >
              Kembali ke Beranda
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/dashboard/student')}
              >
                Kembali ke Beranda
              </Button>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  // Handle cancel order
                  navigate('/dashboard/student');
                }}
              >
                Batalkan Pesanan
              </Button>
            </>
          )}
        </div>

        {/* Live Updates */}
        {currentStep < 4 && (
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Mendapatkan update real-time...
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;