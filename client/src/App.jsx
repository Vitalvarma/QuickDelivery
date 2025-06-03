import LoginPage from "./pages/loginPage.jsx"
import RegisterPage from "./pages/registerPage.jsx"
import Dashboard from "./pages/dashboard.jsx"
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Routes>
        <Route index path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  )
}

export default App
