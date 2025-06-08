import useAuthStore from '../stores/authStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const username = user?.username || 'User';
  const userRole = user?.role || 'guest';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Semantic HTML structure with aria roles */}
      <header role="banner" className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your Dashboard, <span className="text-blue-600">{username}</span>
        </h1>
        <p className="text-gray-700">
          Hello, <strong>{username}</strong>! Here you can manage your account and view your Deliveries.
        </p>
      </header>

      <main role="main" className="max-w-4xl mx-auto p-6">
        {/* More prominent role display with better semantics */}
        <section aria-label="User information">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Account Details</h2>
            <p className="text-gray-800">
              <span className="font-medium">Role:</span>{' '}
              <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                {userRole}
              </span>
            </p>
          </div>
        </section>

        {/* Add more sections that search engines can recognize */}
        <section aria-label="Quick actions" className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-medium text-gray-900">Your Deliveries</h3>
              <p className="text-gray-600 text-sm mt-1">View and manage your Deliveries</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-medium text-gray-900">Account Settings</h3>
              <p className="text-gray-600 text-sm mt-1">Update your profile and preferences</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;