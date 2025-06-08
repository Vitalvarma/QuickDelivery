import { useEffect, useState } from 'react';
import DeliveryComponent from '../../components/delivery.component.jsx'
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import useDeliveryStore from '../../stores/deliveryStore.js';

const Deliveries = () => {
  const { user } = useAuthStore();
  const { getCustomerDeliveries, getAllDeliveries, deliveries, loading } = useDeliveryStore();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user?.role === 'customer') {
      getCustomerDeliveries();
    } else {
      getAllDeliveries();
    }
  }, [user, getCustomerDeliveries, getAllDeliveries]);

  // Filter and sort deliveries
  const filteredDeliveries = deliveries
    .filter(delivery => {
      switch (activeTab) {
        case 'pending':
          return delivery.deliveryStatus === 'pending';
        case 'inprogress':
          return delivery.deliveryStatus === 'inprogress';
        case 'delivered':
          return delivery.deliveryStatus === 'delivered';
        case 'completed':
          return delivery.deliveryStatus === 'completed';
        default:
          return true; // 'all' tab
      }
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Newest first

  const tabs = [
    { id: 'all', name: 'All' },
    { id: 'pending', name: 'Pending' },
    { id: 'inprogress', name: 'In Progress' },
    { id: 'delivered', name: 'Delivered' },
    { id: 'completed', name: 'Completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Deliveries</h1>
        <p className="text-gray-600">View and manage all your deliveries</p>
        
        {/* Status Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredDeliveries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeliveries.map((delivery) => (
                <DeliveryComponent key={delivery._id} delivery={delivery} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Deliveries</h3>
              <p className="mt-1 text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? "You haven't placed any Deliveries yet."
                  : `No ${activeTab} Deliveries found.`}
              </p>
            </div>
          )}
        </>
      )}

      {user?.role === 'customer' && (
        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-600 mb-4">Ready to create a new delivery?</p>
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="-ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Place New Delivery
          </Link>
        </div>
      )}
    </div>
  );
};

export default Deliveries;