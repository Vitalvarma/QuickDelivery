import useAuthStore from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    logout
  } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.username || 'User'}!
          </h1>
          <Link to='dashboard/profile'><span className="text-gray-600">Profile</span></Link>
          <Link to="/dashboard/orders"><span className="text-gray-600">orders</span></Link> 
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </header>
      
    </div>
  );
};

export default Dashboard;