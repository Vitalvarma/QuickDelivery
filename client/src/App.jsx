import LoginPage from "./pages/authentication/loginPage.jsx"
import RegisterPage from "./pages/authentication/registerPage.jsx"

import Orders from "./pages/order/orders.jsx"
import OrderPage from "./pages/order/orderPage.jsx"
import DeliveryOrderForm from "./pages/order/placeDelivery.jsx"

import Profile from "./pages/profile.jsx"
import ErrorPage from "./pages/errorPage.jsx"
import Dashboard from "./pages/dashboard.jsx"
import Navbar from "./components/navbar.jsx";
import Setting from "./pages/settings.jsx";

import useAuthStore from "./stores/authStore.js";

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {

  const { isAuthenticated, isLoading, checkAuth,user } = useAuthStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth,isAuthenticated]);

  if(isLoading){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {isAuthenticated && <Navbar/> }
      
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}/>
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />} />
        <Route path="/orders/:id" element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" replace />} />
        {(isAuthenticated && user.role === 'customer') && (
          <Route path="/create" element={<DeliveryOrderForm />} />
        )}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to='/dashboard' replace/>} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to='/dashboard' replace/>} />
        <Route path="/settings" element={isAuthenticated ? <Setting/> : <Navigate to="/login" replace />}/>
      </Routes>
    </>
  )
}

export default App
