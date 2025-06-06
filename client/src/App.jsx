import LoginPage from "./pages/loginPage.jsx"
import RegisterPage from "./pages/registerPage.jsx"
import Dashboard from "./pages/dashboard.jsx"
import Navbar from "./components/navbar.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./stores/authStore.js";
import { useEffect } from "react";

function App() {
  const { isAuthenticated, isLoading, checkAuth , user } = useAuthStore();

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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} >
          <Route path="/profile" element={<Profile/>} />

          {user?.role === "customer" && (
            <Route path='/orders' element={<Orders/>} >
              <Route path=":orderId" element={<OrderDetails />} />
            </Route>
          )}
          {user?.role === "delivery" && (
            <Route path="/deliveries" element={<Deliveries />} >
              <Route path=":deliveryId" element={<DeliveryDetails />} />
            </Route>
          )}
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
