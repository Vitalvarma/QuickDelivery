import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-semibold">
            Dashboard
          </Link>
          <Link to="/dashboard/profile" className="text-gray-700 hover:text-gray-900 font-semibold">
            Profile
          </Link>
          <Link to="/dashboard/orders" className="text-gray-700 hover:text-gray-900 font-semibold">
            Orders
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Hello, {user?.username || 'User'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
