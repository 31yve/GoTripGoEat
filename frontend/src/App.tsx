import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SchoolCatalog from "./pages/school/SchoolCatalog";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import SellerDashboard from "./pages/dashboard/SellerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Checkout from "./pages/order/Checkout";
import OrderTracking from "./pages/order/OrderTracking";
import NotFound from "./pages/auth/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Hanya satu retry, set ke 3 kali
      staleTime: 5 * 60 * 1000, // 5 menit
      refetchOnWindowFocus: false,
      // Hapus duplikasi retry function di sini
    },
    mutations: {
      retry: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/school/:schoolId" element={<SchoolCatalog />} />
                <Route
                  path="/dashboard/student"
                  element={
                    <ProtectedRoute role="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/seller"
                  element={
                    <ProtectedRoute role="seller">
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;