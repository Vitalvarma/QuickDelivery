import { Link } from 'react-router-dom';

const OrdersComponent = ({ order }) => {
  const {
    _id,
    customerId,
    driverId,
    packageDetails,
    pickupLocation,
    deliveryLocation,
    packageWeight,
    packageType,
    createdAt,
  } = order;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link 
      to={`${_id}`} 
      className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
    >
      <div className="p-5">
        {/* Header with ID and status */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            Order #{_id.slice(-6).toUpperCase()}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {packageType}
          </span>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Package information */}
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Package Details</p>
              <p className="text-gray-800 line-clamp-2">{packageDetails}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Weight</p>
                <p className="text-gray-800">{packageWeight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-gray-800">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Location information */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Pickup Location</p>
              <p className="text-gray-800 truncate">{pickupLocation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Delivery Location</p>
              <p className="text-gray-800 truncate">{deliveryLocation}</p>
            </div>
          </div>
        </div>

        {/* IDs at bottom */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
          <span>Customer: {customerId?.toString() || 'N/A'}</span>
          <span>Driver: {driverId?.toString() || 'Not assigned'}</span>
        </div>
      </div>
    </Link>
  );
};

export default OrdersComponent;