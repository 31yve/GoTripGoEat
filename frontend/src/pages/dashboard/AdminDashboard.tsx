import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToastProvider } from '@/components/ui/toast-provider';
import { 
  Users, School, Store, Package, Settings,
  Plus, Edit, Trash2, Eye, BarChart3, Bell,
  User, ChevronDown, Shield, Database,
  TrendingUp, Award, MessageCircle, Calendar,
  MapPin, Activity, CreditCard, CheckCircle,
  Loader2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToastProvider();
  const [activeTab, setActiveTab] = useState('users');
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showSellerDetail, setShowSellerDetail] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showEditSchool, setShowEditSchool] = useState(false);
  const [showDeleteSchoolConfirm, setShowDeleteSchoolConfirm] = useState(false);
  const [showAddSellerModal, setShowAddSellerModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState(false);
  const [showEditSellerModal, setShowEditSellerModal] = useState(false);
  const [showDeleteSellerConfirm, setShowDeleteSellerConfirm] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [showDeleteOrderConfirm, setShowDeleteOrderConfirm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [newSchool, setNewSchool] = useState({
    name: '',
    address: '',
    contact: '',
    students: 0,
    canteens: 0
  });
  const [newSeller, setNewSeller] = useState({
    name: '',
    canteen: '',
    school: '',
    phone: '',
    email: ''
  });
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    phone: '',
    school: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [newOrder, setNewOrder] = useState({
    customer: '',
    seller: '',
    total: 0,
    status: 'processing'
  });
  const [saving, setSaving] = useState(false);

  // Local notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Sekolah Baru Terdaftar', message: 'SMK 2 Bandung telah mendaftar ke platform', time: '30 menit lalu', read: false },
    { id: 2, title: 'Laporan Penjualan', message: 'Laporan penjualan mingguan siap untuk ditinjau', time: '2 jam lalu', read: false },
    { id: 3, title: 'User Baru', message: '5 siswa baru bergabung hari ini', time: '4 jam lalu', read: true }
  ]);

  // DATA STATES
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const token = localStorage.getItem('token') || '';

    const fetchAllData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      try {
        setLoading(true);
        setError(null);

        const [usersRes, schoolsRes, sellersRes, ordersRes] = await Promise.all([
          fetch('http://localhost:3002/api/users', { headers }).then(r => r.json().catch(() => [])),
          fetch('http://localhost:3002/api/schools', { headers }).then(r => r.json().catch(() => [])),
          fetch('http://localhost:3002/api/sellers', { headers }).then(r => r.json().catch(() => [])),
          fetch('http://localhost:3002/api/orders', { headers }).then(r => r.json().catch(() => []))
        ]);

        setUsers(Array.isArray(usersRes) ? usersRes : []);
        setSchools(Array.isArray(schoolsRes) ? schoolsRes : []);
        setSellers(Array.isArray(sellersRes) ? sellersRes : []);
        setOrders(Array.isArray(ordersRes) ? ordersRes : []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data dari server');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Function untuk refetch data
  const refetchData = () => {
    const token = localStorage.getItem('token') || '';
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, schoolsRes, sellersRes, ordersRes] = await Promise.all([
          fetch('http://localhost:3002/api/users', { headers }).then(r => r.json().catch(() => [])),
          fetch('http://localhost:3002/api/schools', { headers }).then(r => r.json().catch(() => [])),
          fetch('http://localhost:3002/api/sellers', { headers }).then(r => r.json().catch(() => [])),
          fetch('http://localhost:3002/api/orders', { headers }).then(r => r.json().catch(() => []))
        ]);

        setUsers(Array.isArray(usersRes) ? usersRes : []);
        setSchools(Array.isArray(schoolsRes) ? schoolsRes : []);
        setSellers(Array.isArray(sellersRes) ? sellersRes : []);
        setOrders(Array.isArray(ordersRes) ? ordersRes : []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data dari server');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  };

  // --- START USER FUNCTIONS ---
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.role || !newUser.password || !newUser.confirmPassword) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field'
      });
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Password dan konfirmasi password tidak cocok'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch('http://localhost:3002/api/users', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          school: newUser.school,
          role: newUser.role,
          password: newUser.password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newUserData = await response.json();
      setUsers(prev => [newUserData, ...prev]);

      showToast({
        type: 'success',
        title: 'User Ditambahkan',
        description: `${newUser.username} berhasil ditambahkan`
      });
      
      setShowAddUserModal(false);
      setNewUser({ username: '', email: '', phone: '', school: '', role: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error adding user:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal menambahkan user'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      school: user.school,
      role: user.role || user.role_name,
      password: '',
      confirmPassword: ''
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.role) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi username, email, dan role user'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const updateData = {
          username: newUser.username,
          email: newUser.email,
          phone: newUser.phone,
          school: newUser.school,
          role: newUser.role
      };
      // Jika password diisi, tambahkan ke payload
      if (newUser.password) {
        if (newUser.password !== newUser.confirmPassword) {
            showToast({ type: 'error', title: 'Error', description: 'Password tidak cocok' });
            setSaving(false);
            return;
        }
        updateData.password = newUser.password;
      }

      const response = await fetch(`http://localhost:3002/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      setUsers((prev) => prev.map(u => 
        u.id === selectedUser.id ? updatedUser : u
      ));
      
      showToast({
        type: 'success',
        title: 'User Diperbarui',
        description: `${newUser.username} berhasil diperbarui`
      });
      
      setShowEditUserModal(false);
      setSelectedUser(null);
      setNewUser({ username: '', email: '', phone: '', school: '', role: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error('Error updating user:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal memperbarui user'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteUserConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (selectedUser) {
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        const headers = {
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`http://localhost:3002/api/users/${selectedUser.id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setUsers(users.filter((u) => u.id !== selectedUser.id));
        showToast({
          type: 'success',
          title: 'User Dihapus',
          description: `${selectedUser.name} berhasil dihapus`
        });
      } catch (err) {
        console.error('Error deleting user:', err);
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Gagal menghapus user'
        });
      } finally {
        setSaving(false);
      }
    }
    setShowDeleteUserConfirm(false);
    setSelectedUser(null);
  };
  // --- END USER FUNCTIONS ---

  // --- START SCHOOL FUNCTIONS ---
  const handleEditSchool = (school) => {
    setSelectedSchool(school);
    setNewSchool({
      name: school.name,
      address: school.address,
      contact: school.contact || '',
      students: school.students || 0,
      canteens: school.canteens || 0
    });
    setShowEditSchool(true);
  };

  const handleAddSchool = async () => {
    if (!newSchool.name || !newSchool.address) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi nama dan alamat sekolah'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch('http://localhost:3002/api/schools', {
        method: 'POST',
        headers,
        body: JSON.stringify(newSchool)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newSchoolData = await response.json();
      setSchools(prev => [newSchoolData, ...prev]);

      showToast({
        type: 'success',
        title: 'Sekolah Ditambahkan',
        description: `${newSchool.name} berhasil ditambahkan`
      });
      
      setShowAddSchoolModal(false);
      setNewSchool({ name: '', address: '', contact: '', students: 0, canteens: 0 });
    } catch (err) {
      console.error('Error adding school:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal menambahkan sekolah'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSchool = async () => {
    if (!newSchool.name || !newSchool.address) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi nama dan alamat sekolah'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`http://localhost:3002/api/schools/${selectedSchool.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(newSchool)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updatedSchool = await response.json();
      setSchools((prev) => prev.map(s => 
        s.id === selectedSchool.id ? updatedSchool : s
      ));
      
      showToast({
        type: 'success',
        title: 'Sekolah Diperbarui',
        description: `${newSchool.name} berhasil diperbarui`
      });
      
      setShowEditSchool(false);
      setSelectedSchool(null);
      setNewSchool({ name: '', address: '', contact: '', students: 0, canteens: 0 });
    } catch (err) {
      console.error('Error updating school:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal memperbarui sekolah'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchool = (school) => {
    setSelectedSchool(school);
    setShowDeleteSchoolConfirm(true);
  };

  const confirmDeleteSchool = async () => {
    if (selectedSchool) {
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        const headers = {
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`http://localhost:3002/api/schools/${selectedSchool.id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setSchools(schools.filter((s) => s.id !== selectedSchool.id));
        showToast({
          type: 'success',
          title: 'Sekolah Dihapus',
          description: `${selectedSchool.name} berhasil dihapus`
        });
      } catch (err) {
        console.error('Error deleting school:', err);
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Gagal menghapus sekolah'
        });
      } finally {
        setSaving(false);
      }
    }
    setShowDeleteSchoolConfirm(false);
    setSelectedSchool(null);
  };
  // --- END SCHOOL FUNCTIONS ---

  // --- START SELLER FUNCTIONS ---
  const handleAddSeller = async () => {
    if (!newSeller.name || !newSeller.canteen || !newSeller.school || !newSeller.phone || !newSeller.email) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch('http://localhost:3002/api/sellers', {
        method: 'POST',
        headers,
        body: JSON.stringify(newSeller)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newSellerData = await response.json();
      setSellers(prev => [newSellerData, ...prev]);

      showToast({
        type: 'success',
        title: 'Penjual Ditambahkan',
        description: `${newSeller.name} berhasil ditambahkan`
      });
      
      setShowAddSellerModal(false);
      setNewSeller({ name: '', canteen: '', school: '', phone: '', email: '' });
    } catch (err) {
      console.error('Error adding seller:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal menambahkan penjual'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setShowSellerDetail(true);
  };

  const handleEditSeller = (seller) => {
    setSelectedSeller(seller);
    setNewSeller({
      name: seller.name,
      canteen: seller.canteen,
      school: seller.school,
      phone: seller.phone,
      email: seller.email || ''
    });
    setShowEditSellerModal(true);
  };

  const handleUpdateSeller = async () => {
    if (!newSeller.name || !newSeller.canteen || !newSeller.school || !newSeller.phone || !newSeller.email) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch(`http://localhost:3002/api/sellers/${selectedSeller.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(newSeller)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updatedSeller = await response.json();
      setSellers((prev) => prev.map(s => 
        s.id === selectedSeller.id ? updatedSeller : s
      ));
      
      showToast({
        type: 'success',
        title: 'Penjual Diperbarui',
        description: `${newSeller.name} berhasil diperbarui`
      });
      
      setShowEditSellerModal(false);
      setSelectedSeller(null);
      setNewSeller({ name: '', canteen: '', school: '', phone: '', email: '' });
    } catch (err) {
      console.error('Error updating seller:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal memperbarui penjual'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSeller = (seller) => {
    setSelectedSeller(seller);
    setShowDeleteSellerConfirm(true);
  };

  const confirmDeleteSeller = async () => {
    if (selectedSeller) {
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        const headers = {
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`http://localhost:3002/api/sellers/${selectedSeller.id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setSellers(sellers.filter((s) => s.id !== selectedSeller.id));
        showToast({
          type: 'success',
          title: 'Penjual Dihapus',
          description: `${selectedSeller.name} berhasil dihapus`
        });
      } catch (err) {
        console.error('Error deleting seller:', err);
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Gagal menghapus penjual'
        });
      } finally {
        setSaving(false);
      }
    }
    setShowDeleteSellerConfirm(false);
    setSelectedSeller(null);
  };
  // --- END SELLER FUNCTIONS ---

  // --- START ORDER FUNCTIONS ---
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };
  
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setNewOrder({
      customer: order.customer,
      seller: order.seller,
      total: order.total,
      status: order.status
    });
    setShowEditOrderModal(true);
  };

  const handleUpdateOrder = async () => {
    if (!newOrder.customer || !newOrder.seller || !newOrder.total || !newOrder.status) {
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Harap isi semua field'
      });
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const response = await fetch(`http://localhost:3002/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const updatedOrder = await response.json();
      setOrders((prev) => prev.map(o => 
        o.id === selectedOrder.id ? updatedOrder : o
      ));
      
      showToast({
        type: 'success',
        title: 'Pesanan Diperbarui',
        description: `Pesanan ${newOrder.customer} berhasil diperbarui`
      });
      
      setShowEditOrderModal(false);
      setSelectedOrder(null);
      setNewOrder({ customer: '', seller: '', total: 0, status: 'processing' });
    } catch (err) {
      console.error('Error updating order:', err);
      showToast({
        type: 'error',
        title: 'Error',
        description: 'Gagal memperbarui pesanan'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteOrderConfirm(true);
  };

  const confirmDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        setSaving(true);
        const token = localStorage.getItem('token');
        const headers = {
          ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`http://localhost:3002/api/orders/${selectedOrder.id}`, {
          method: 'DELETE',
          headers
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        setOrders(orders.filter((o) => o.id !== selectedOrder.id));
        showToast({
          type: 'success',
          title: 'Pesanan Dihapus',
          description: `Pesanan ${selectedOrder.customer} berhasil dihapus`
        });
      } catch (err) {
        console.error('Error deleting order:', err);
        showToast({
          type: 'error',
          title: 'Error',
          description: 'Gagal menghapus pesanan'
        });
      } finally {
        setSaving(false);
      }
    }
    setShowDeleteOrderConfirm(false);
    setSelectedOrder(null);
  };

  const handleShowReport = () => {
    setReportData({
      totalUsers: users.length,
      totalSchools: schools.length,
      totalSellers: sellers.length,
      totalOrders: orders.length,
      orders: orders,
      schools: schools,
      users: users,
      sellers: sellers,
      timestamp: new Date().toISOString()
    });
    setShowReportModal(true);
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'siswa':
      case 'student':
        return <Badge className="bg-blue-100 text-blue-700">Siswa</Badge>;
      case 'penjual':
      case 'seller':
        return <Badge className="bg-orange-100 text-orange-700">Penjual</Badge>;
      case 'admin':
        return <Badge className="bg-red-100 text-red-700">Admin</Badge>;
      case 'guru':
      case 'teacher':
        return <Badge className="bg-purple-100 text-purple-700">Guru</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
      case 'active':
      case 'selesai':
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Aktif</Badge>;
      case 'diproses':
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">Diproses</Badge>;
      case 'nonaktif':
      case 'inactive':
      case 'dibatalkan':
      case 'cancelled':
        return <Badge variant="outline">Nonaktif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold text-destructive">Gagal Memuat Data</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetchData} className="w-full">
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  // Users Tab
  if (activeTab === 'users') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Data User</h1>
              <div className="flex items-center space-x-2">
                <Button onClick={() => setShowAddUserModal(true)} size="sm">
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
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Users List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada user.</p>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{user.username || user.name || user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.school}</p>
                    <div className="mt-2">
                      {getRoleBadge(user.role || user.role_name)}
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewUser(user)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Add User Modal */}
        <AddUserModal
          isOpen={showAddUserModal}
          onClose={() => {
            setShowAddUserModal(false);
            setNewUser({ username: '', email: '', phone: '', school: '', role: '', password: '', confirmPassword: '' });
          }}
          newUser={newUser}
          setNewUser={setNewUser}
          schools={schools}
          onSubmit={handleAddUser}
          saving={saving}
        />

        {/* User Detail Modal */}
        <UserDetailModal 
          isOpen={showUserDetail} 
          onClose={() => { setShowUserDetail(false); setSelectedUser(null); }} 
          user={selectedUser}
          getRoleBadge={getRoleBadge}
        />

        {/* Edit User Modal */}
        <EditUserModal 
          isOpen={showEditUserModal}
          onClose={() => { setShowEditUserModal(false); setSelectedUser(null); }}
          user={selectedUser}
          newUser={newUser}
          setNewUser={setNewUser}
          schools={schools}
          onSubmit={handleUpdateUser}
          saving={saving}
        />

        {/* Delete User Confirmation Modal */}
        <DeleteUserModal 
          isOpen={showDeleteUserConfirm}
          onClose={() => { setShowDeleteUserConfirm(false); setSelectedUser(null); }}
          user={selectedUser}
          onConfirm={confirmDeleteUser}
          saving={saving}
        />

        {/* Notifications Modal */}
        <NotificationsModal 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          setNotifications={setNotifications}
          showToast={showToast}
        />
      </div>
    );
  }

  // Schools Tab
  if (activeTab === 'schools') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Data Sekolah</h1>
              <Button onClick={() => setShowAddSchoolModal(true)} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Tambah
              </Button>
            </div>
          </div>
        </header>

        {/* Schools List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto">
          {schools.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada data sekolah.</p>
          ) : (
            schools.map((school) => (
              <Card key={school.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{school.name}</h3>
                    <p className="text-sm text-muted-foreground">{school.address}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {school.students} Siswa
                      </span>
                      <span className="flex items-center">
                        <Store className="w-4 h-4 mr-1" />
                        {school.canteens} Kantin
                      </span>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditSchool(school)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteSchool(school)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Add School Modal */}
        <AddSchoolModal
          isOpen={showAddSchoolModal}
          onClose={() => setShowAddSchoolModal(false)}
          newSchool={newSchool}
          setNewSchool={setNewSchool}
          onSubmit={handleAddSchool}
          saving={saving}
        />

        {/* Edit School Modal */}
        <EditSchoolModal
          isOpen={showEditSchool}
          onClose={() => {
            setShowEditSchool(false);
            setSelectedSchool(null);
            setNewSchool({ name: '', address: '', contact: '', students: 0, canteens: 0 });
          }}
          school={selectedSchool}
          newSchool={newSchool}
          setNewSchool={setNewSchool}
          onSubmit={handleUpdateSchool}
          saving={saving}
        />

        {/* Delete School Confirmation Modal */}
        <DeleteSchoolModal
          isOpen={showDeleteSchoolConfirm}
          onClose={() => {
            setShowDeleteSchoolConfirm(false);
            setSelectedSchool(null);
          }}
          school={selectedSchool}
          onConfirm={confirmDeleteSchool}
          saving={saving}
        />
      </div>
    );
  }

  // Sellers Tab
  if (activeTab === 'sellers') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Data Penjual</h1>
              <Button size="sm" variant="outline" onClick={() => setShowAddSellerModal(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Tambah Penjual
              </Button>
            </div>
          </div>
        </header>

        {/* Sellers List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {sellers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada data penjual.</p>
          ) : (
            sellers.map((seller) => (
              <Card key={seller.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{seller.name}</h3>
                    <p className="text-sm text-muted-foreground">{seller.canteen}</p>
                    <p className="text-sm text-muted-foreground">{seller.school}</p>
                    <div className="mt-2">
                      {getStatusBadge(seller.status)}
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewSeller(seller)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditSeller(seller)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteSeller(seller)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Seller Detail Modal */}
        <SellerDetailModal 
          isOpen={showSellerDetail} 
          onClose={() => { setShowSellerDetail(false); setSelectedSeller(null); }} 
          seller={selectedSeller}
          getStatusBadge={getStatusBadge}
        />

        {/* Edit Seller Modal */}
        <EditSellerModal 
          isOpen={showEditSellerModal}
          onClose={() => { setShowEditSellerModal(false); setSelectedSeller(null); }}
          seller={selectedSeller}
          newSeller={newSeller}
          setNewSeller={setNewSeller}
          onSubmit={handleUpdateSeller}
          saving={saving}
        />

        {/* Delete Seller Confirmation Modal */}
        <DeleteSellerModal 
          isOpen={showDeleteSellerConfirm}
          onClose={() => { setShowDeleteSellerConfirm(false); setSelectedSeller(null); }}
          seller={selectedSeller}
          onConfirm={confirmDeleteSeller}
          saving={saving}
        />

        {/* Add Seller Modal */}
        <AddSellerModal
          isOpen={showAddSellerModal}
          onClose={() => setShowAddSellerModal(false)}
          newSeller={newSeller}
          setNewSeller={setNewSeller}
          onSubmit={handleAddSeller}
          saving={saving}
        />
      </div>
    );
  }

  // Orders Tab
  if (activeTab === 'orders') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Data Pesanan</h1>
              <Button size="sm" variant="outline" onClick={handleShowReport}>
                <BarChart3 className="w-4 h-4 mr-1" />
                Laporan
              </Button>
            </div>
          </div>
        </header>

        {/* Orders List */}
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada data pesanan.</p>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">{order.customer} → {order.seller}</p>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-primary">
                        Rp {order.total?.toLocaleString('id-ID') || '0'}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewOrder(order)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEditOrder(order)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteOrder(order)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Order Detail Modal */}
        <OrderDetailModal 
          isOpen={showOrderDetail} 
          onClose={() => { setShowOrderDetail(false); setSelectedOrder(null); }} 
          order={selectedOrder}
          getStatusBadge={getStatusBadge}
        />

        {/* Edit Order Modal */}
        <EditOrderModal 
          isOpen={showEditOrderModal}
          onClose={() => { setShowEditOrderModal(false); setSelectedOrder(null); }}
          order={selectedOrder}
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          onSubmit={handleUpdateOrder}
          saving={saving}
        />

        {/* Delete Order Confirmation Modal */}
        <DeleteOrderModal 
          isOpen={showDeleteOrderConfirm}
          onClose={() => { setShowDeleteOrderConfirm(false); setSelectedOrder(null); }}
          order={selectedOrder}
          onConfirm={confirmDeleteOrder}
          saving={saving}
        />

        {/* Report Modal */}
        <ReportModal 
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          data={reportData}
        />
      </div>
    );
  }

  // Settings Tab
  if (activeTab === 'settings') {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b">
          <div className="px-4 py-4">
            <h1 className="text-xl font-bold">Pengaturan Admin</h1>
          </div>
        </header>

        <div className="p-4 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Ubah Password Admin</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="oldPassword">Password Lama</Label>
                <Input id="oldPassword" type="password" placeholder="Password lama" />
              </div>
              <div>
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input id="newPassword" type="password" placeholder="Password baru" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" placeholder="Konfirmasi password baru" />
              </div>
            </div>
            <Button className="w-full mt-3">Ubah Password</Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-3">Statistik Platform</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total User</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{schools.length}</p>
                <p className="text-sm text-muted-foreground">Total Sekolah</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{sellers.length}</p>
                <p className="text-sm text-muted-foreground">Total Penjual</p>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Pesanan</p>
              </div>
            </div>
          </Card>

          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </div>

        <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    );
  }

  return null;
};

// Reusable Bottom Navigation Component
const BottomNavigation = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-card border-t z-10">
    <div className="flex items-center justify-around py-2 text-xs">
      {[
        { id: 'users', icon: Users, label: 'User' },
        { id: 'schools', icon: School, label: 'Sekolah' },
        { id: 'sellers', icon: Store, label: 'Penjual' },
        { id: 'orders', icon: Package, label: 'Pesanan' },
        { id: 'settings', icon: Settings, label: 'Setting' }
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
);

// Reusable Modal Components
const AddUserModal = ({ isOpen, onClose, newUser, setNewUser, schools, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Tambah User Baru">
    <div className="space-y-4">
      <div>
        <Label htmlFor="addUserUsername">Username</Label>
        <Input
          id="addUserUsername"
          placeholder="Masukkan username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="addUserEmail">Email</Label>
        <Input
          id="addUserEmail"
          placeholder="Masukkan email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="addUserPhone">No. Telepon</Label>
        <Input
          id="addUserPhone"
          placeholder="Masukkan nomor telepon"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="addUserSchool">Sekolah</Label>
        <Select value={newUser.school} onValueChange={(value) => setNewUser({ ...newUser, school: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Sekolah" />
          </SelectTrigger>
          <SelectContent>
            {schools.map(school => (
              <SelectItem key={school.id} value={school.name}>{school.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="addUserRole">Role</Label>
        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="guru">Guru</SelectItem>
            <SelectItem value="siswa">Siswa</SelectItem>
            <SelectItem value="penjual">Penjual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="addUserPassword">Password</Label>
        <Input
          id="addUserPassword"
          type="password"
          placeholder="Masukkan password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="addUserConfirmPassword">Konfirmasi Password</Label>
        <Input
          id="addUserConfirmPassword"
          type="password"
          placeholder="Konfirmasi password"
          value={newUser.confirmPassword}
          onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Tambah User'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const UserDetailModal = ({ isOpen, onClose, user, getRoleBadge }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Detail User">
    {user && (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.username || user.name || user.full_name}</h3>
            {getRoleBadge(user.role || user.role_name)}
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sekolah</p>
            <p className="font-medium">{user.school}</p>
          </div>
          {user.class && (
            <div>
              <p className="text-sm text-muted-foreground">Kelas</p>
              <p className="font-medium">{user.class}</p>
            </div>
          )}
          {user.phone && (
            <div>
              <p className="text-sm text-muted-foreground">No. Telepon</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          )}
        </div>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Tutup
        </Button>
      </div>
    )}
  </Modal>
);

const EditUserModal = ({ isOpen, onClose, user, newUser, setNewUser, schools, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
    <div className="space-y-4">
      <div>
        <Label htmlFor="editUserUsername">Username</Label>
        <Input
          id="editUserUsername"
          placeholder="Masukkan username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editUserEmail">Email</Label>
        <Input
          id="editUserEmail"
          placeholder="Masukkan email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editUserPhone">No. Telepon</Label>
        <Input
          id="editUserPhone"
          placeholder="Masukkan nomor telepon"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editUserSchool">Sekolah</Label>
        <Select value={newUser.school} onValueChange={(value) => setNewUser({ ...newUser, school: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Sekolah" />
          </SelectTrigger>
          <SelectContent>
            {schools.map(school => (
              <SelectItem key={school.id} value={school.name}>{school.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="editUserRole">Role</Label>
        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="guru">Guru</SelectItem>
            <SelectItem value="siswa">Siswa</SelectItem>
            <SelectItem value="penjual">Penjual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="editUserPassword">Password Baru</Label>
        <Input
          id="editUserPassword"
          type="password"
          placeholder="Isi untuk ubah password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editUserConfirmPassword">Konfirmasi Password Baru</Label>
        <Input
          id="editUserConfirmPassword"
          type="password"
          placeholder="Konfirmasi password baru"
          value={newUser.confirmPassword}
          onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memperbarui...
            </>
          ) : (
            'Update User'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const DeleteUserModal = ({ isOpen, onClose, user, onConfirm, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Hapus User">
    <div className="space-y-4">
      <p>Apakah Anda yakin ingin menghapus user <strong>{user?.username}</strong>?</p>
      <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onConfirm}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            'Hapus'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const AddSchoolModal = ({ isOpen, onClose, newSchool, setNewSchool, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Tambah Sekolah Baru">
    <div className="space-y-4">
      <div>
        <Label htmlFor="schoolName">Nama Sekolah</Label>
        <Input
          id="schoolName"
          placeholder="Masukkan nama sekolah"
          value={newSchool.name}
          onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="schoolAddress">Alamat</Label>
        <Input
          id="schoolAddress"
          placeholder="Masukkan alamat sekolah"
          value={newSchool.address}
          onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="schoolContact">Kontak</Label>
        <Input
          id="schoolContact"
          placeholder="Nomor telepon / email (opsional)"
          value={newSchool.contact}
          onChange={(e) => setNewSchool({...newSchool, contact: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="schoolStudents">Jumlah Siswa</Label>
        <Input
          id="schoolStudents"
          type="number"
          placeholder="Masukkan jumlah siswa"
          value={newSchool.students}
          onChange={(e) => setNewSchool({...newSchool, students: parseInt(e.target.value) || 0})}
        />
      </div>
      <div>
        <Label htmlFor="schoolCanteens">Jumlah Kantin</Label>
        <Input
          id="schoolCanteens"
          type="number"
          placeholder="Masukkan jumlah kantin"
          value={newSchool.canteens}
          onChange={(e) => setNewSchool({...newSchool, canteens: parseInt(e.target.value) || 0})}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Tambah Sekolah'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const EditSchoolModal = ({ isOpen, onClose, school, newSchool, setNewSchool, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Sekolah">
    <div className="space-y-4">
      <div>
        <Label htmlFor="editSchoolName">Nama Sekolah</Label>
        <Input
          id="editSchoolName"
          placeholder="Masukkan nama sekolah"
          value={newSchool.name}
          onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="editSchoolAddress">Alamat</Label>
        <Input
          id="editSchoolAddress"
          placeholder="Masukkan alamat sekolah"
          value={newSchool.address}
          onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="editSchoolContact">Kontak</Label>
        <Input
          id="editSchoolContact"
          placeholder="Nomor telepon / email (opsional)"
          value={newSchool.contact}
          onChange={(e) => setNewSchool({...newSchool, contact: e.target.value})}
        />
      </div>
      <div>
        <Label htmlFor="editSchoolStudents">Jumlah Siswa</Label>
        <Input
          id="editSchoolStudents"
          type="number"
          placeholder="Masukkan jumlah siswa"
          value={newSchool.students}
          onChange={(e) => setNewSchool({...newSchool, students: parseInt(e.target.value) || 0})}
        />
      </div>
      <div>
        <Label htmlFor="editSchoolCanteens">Jumlah Kantin</Label>
        <Input
          id="editSchoolCanteens"
          type="number"
          placeholder="Masukkan jumlah kantin"
          value={newSchool.canteens}
          onChange={(e) => setNewSchool({...newSchool, canteens: parseInt(e.target.value) || 0})}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memperbarui...
            </>
          ) : (
            'Update Sekolah'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const DeleteSchoolModal = ({ isOpen, onClose, school, onConfirm, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Hapus Sekolah">
    <div className="space-y-4">
      <p>Apakah Anda yakin ingin menghapus sekolah <strong>{school?.name}</strong>?</p>
      <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onConfirm}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            'Hapus'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const AddSellerModal = ({ isOpen, onClose, newSeller, setNewSeller, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Tambah Penjual Baru">
    <div className="space-y-4">
      <div>
        <Label htmlFor="sellerName">Nama Penjual</Label>
        <Input
          id="sellerName"
          placeholder="Masukkan nama penjual"
          value={newSeller.name}
          onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="sellerCanteen">Nama Kantin</Label>
        <Input
          id="sellerCanteen"
          placeholder="Masukkan nama kantin"
          value={newSeller.canteen}
          onChange={(e) => setNewSeller({ ...newSeller, canteen: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="sellerSchool">Sekolah</Label>
        <Input
          id="sellerSchool"
          placeholder="Masukkan nama sekolah"
          value={newSeller.school}
          onChange={(e) => setNewSeller({ ...newSeller, school: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="sellerPhone">No. Telepon</Label>
        <Input
          id="sellerPhone"
          placeholder="Masukkan no. telepon"
          value={newSeller.phone}
          onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="sellerEmail">Email</Label>
        <Input
          id="sellerEmail"
          placeholder="Masukkan email"
          value={newSeller.email}
          onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Tambah Penjual'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const SellerDetailModal = ({ isOpen, onClose, seller, getStatusBadge }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Detail Penjual">
    {seller && (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Store className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{seller.name}</h3>
            {getStatusBadge(seller.status)}
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Nama Kantin</p>
            <p className="font-medium">{seller.canteen}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sekolah</p>
            <p className="font-medium">{seller.school}</p>
          </div>
          {seller.phone && (
            <div>
              <p className="text-sm text-muted-foreground">No. Telepon</p>
              <p className="font-medium">{seller.phone}</p>
            </div>
          )}
          {seller.email && (
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{seller.email}</p>
            </div>
          )}
          {seller.totalSales && (
            <div>
              <p className="text-sm text-muted-foreground">Total Penjualan</p>
              <p className="font-medium text-primary">Rp {seller.totalSales.toLocaleString('id-ID')}</p>
            </div>
          )}
        </div>
        <Button variant="outline" className="w-full" onClick={onClose}>
          Tutup
        </Button>
      </div>
    )}
  </Modal>
);

const EditSellerModal = ({ isOpen, onClose, seller, newSeller, setNewSeller, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Penjual">
    <div className="space-y-4">
      <div>
        <Label htmlFor="editSellerName">Nama Penjual</Label>
        <Input
          id="editSellerName"
          placeholder="Masukkan nama penjual"
          value={newSeller.name}
          onChange={(e) => setNewSeller({ ...newSeller, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editSellerCanteen">Nama Kantin</Label>
        <Input
          id="editSellerCanteen"
          placeholder="Masukkan nama kantin"
          value={newSeller.canteen}
          onChange={(e) => setNewSeller({ ...newSeller, canteen: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editSellerSchool">Sekolah</Label>
        <Input
          id="editSellerSchool"
          placeholder="Masukkan nama sekolah"
          value={newSeller.school}
          onChange={(e) => setNewSeller({ ...newSeller, school: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editSellerPhone">No. Telepon</Label>
        <Input
          id="editSellerPhone"
          placeholder="Masukkan no. telepon"
          value={newSeller.phone}
          onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editSellerEmail">Email</Label>
        <Input
          id="editSellerEmail"
          placeholder="Masukkan email"
          value={newSeller.email}
          onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memperbarui...
            </>
          ) : (
            'Update Penjual'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const DeleteSellerModal = ({ isOpen, onClose, seller, onConfirm, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Hapus Penjual">
    <div className="space-y-4">
      <p>Apakah Anda yakin ingin menghapus penjual <strong>{seller?.name}</strong>?</p>
      <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onConfirm}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            'Hapus'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const OrderDetailModal = ({ isOpen, onClose, order, getStatusBadge }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Detail Pesanan">
    {order && (
      <div className="space-y-4">
        <div className="border-b pb-3">
          <h3 className="font-semibold">{order.id}</h3>
          <p className="text-sm text-muted-foreground">Tanggal: {order.date}</p>
          {getStatusBadge(order.status)}
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{order.customer}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Penjual</p>
            <p className="font-medium">{order.seller}</p>
          </div>
          {order.items && (
            <div>
              <p className="text-sm text-muted-foreground">Items</p>
              <p className="font-medium">{order.items.length} item</p>
            </div>
          )}
        </div>
        {order.total && (
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        )}
        <Button variant="outline" className="w-full" onClick={onClose}>
          Tutup
        </Button>
      </div>
    )}
  </Modal>
);

const EditOrderModal = ({ isOpen, onClose, order, newOrder, setNewOrder, onSubmit, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Pesanan">
    <div className="space-y-4">
      <div>
        <Label htmlFor="editOrderCustomer">Customer</Label>
        <Input
          id="editOrderCustomer"
          placeholder="Nama customer"
          value={newOrder.customer}
          onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editOrderSeller">Penjual</Label>
        <Input
          id="editOrderSeller"
          placeholder="Nama penjual"
          value={newOrder.seller}
          onChange={(e) => setNewOrder({ ...newOrder, seller: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="editOrderTotal">Total</Label>
        <Input
          id="editOrderTotal"
          type="number"
          placeholder="Total harga"
          value={newOrder.total}
          onChange={(e) => setNewOrder({ ...newOrder, total: parseInt(e.target.value) || 0 })}
        />
      </div>
      <div>
        <Label htmlFor="editOrderStatus">Status</Label>
        <Input
          id="editOrderStatus"
          placeholder="Status pesanan"
          value={newOrder.status}
          onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
        />
      </div>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button className="flex-1" onClick={onSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memperbarui...
            </>
          ) : (
            'Update Pesanan'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const DeleteOrderModal = ({ isOpen, onClose, order, onConfirm, saving }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Hapus Pesanan">
    <div className="space-y-4">
      <p>Apakah Anda yakin ingin menghapus pesanan <strong>{order?.id}</strong>?</p>
      <p className="text-sm text-muted-foreground">Tindakan ini tidak dapat dibatalkan.</p>
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={saving}
        >
          Batal
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onConfirm}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menghapus...
            </>
          ) : (
            'Hapus'
          )}
        </Button>
      </div>
    </div>
  </Modal>
);

const NotificationsModal = ({ isOpen, onClose, notifications, setNotifications, showToast }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Notifikasi Admin">
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {notifications.map((notif) => (
        <div key={notif.id} className={`p-3 rounded-lg border ${
          !notif.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
        }`}>
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
    </div>
    <Button 
      variant="outline" 
      className="w-full mt-4"
      onClick={() => {
        setNotifications(notifications.map(n => ({...n, read: true})));
        showToast({ 
          type: 'success', 
          title: 'Semua notifikasi ditandai sebagai dibaca', 
          description: '' 
        });
      }}
    >
      Tandai Semua Dibaca
    </Button>
  </Modal>
);

const ReportModal = ({ isOpen, onClose, data }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Laporan Terkini">
    <div className="space-y-4">
      <div className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <Button variant="outline" className="w-full" onClick={onClose}>
        Tutup
      </Button>
    </div>
  </Modal>
);

export default AdminDashboard;