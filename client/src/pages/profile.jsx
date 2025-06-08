import useAuthStore from '../stores/authStore';

const Profile = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Profile Header */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Profile Information</h1>
        <p className="text-gray-600 mt-2">View and manage your account details</p>
      </header>

      {/* Profile Details */}
      <div className="space-y-6">
        {/* Username Section */}
        <section className="border-b pb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Account</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-lg font-medium text-gray-900">{user?.username || 'Not set'}</p>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700">Account Status</label>
            <p className="mt-1 text-lg font-medium text-green-600">
              {user?.accountStatus ? user.accountStatus : 'Active'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p> {/* You could add this to your user object */}
          </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="border-b pb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <p className="mt-1 text-lg font-medium text-gray-900">{user?.email || 'Not provided'}</p>
              <p className="mt-1 text-sm text-gray-500">Used for account notifications</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-lg font-medium text-blue-600 capitalize">{user?.role || 'standard'}</p>
              <p className="mt-1 text-sm text-gray-500">Account permissions level</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;