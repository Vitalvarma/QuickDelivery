import React from 'react'
import useAuthStore from '../stores/authStore'

const Profile = () => {

    const {user } = useAuthStore();

  return (
    <div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
            <div className="space-y-4">
            <div>
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <p className="mt-1 text-gray-900">{user?.username}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
    </div>
  )
}

export default Profile
