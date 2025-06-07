import { Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Dashboard = () => {
  const {
    user,
  } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100">
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
          <p className="text-gray-700">Hello, {user?.username || 'User'}! Here you can manage your account and view your orders.</p>
        </div>
        <div className="border-t border-gray-300 pt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
