import { Link } from 'react-router-dom';

const DeliveryComponent = ({ delivery }) => {
  const {
    _id,
    imageUrl,
    customerName,
    driverName,
    packageDetails,
    pickupLocation,
    deliveryLocation,
    packageWeight,
    packageType,
    createdAt,
    deliveryStatus,
    distance,
    cost
  } = delivery;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = () => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      inprogress: 'bg-blue-100 text-blue-800',
      delivered: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
    };
    
    const statusLabels = {
      pending: 'Pending',
      inprogress: 'In Progress',
      delivered: 'Delivered',
      completed: 'Completed',
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusClasses[deliveryStatus] || 'bg-gray-100 text-gray-800'
      }`}>
        {statusLabels[deliveryStatus] || deliveryStatus}
      </span>
    );
  };

  const renderPackageImage = () => {
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt="Package" 
          className="w-full h-40 object-contain rounded-lg shadow-inner border border-gray-200 bg-white"
          style={{ objectPosition: 'center' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '';
          }}
        />
      );
    }
    return (
      <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
    );
  };

  return (
    <Link 
      to={`${_id}`} 
      className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200 hover:-translate-y-0.5"
    >
      <div className="p-5">
        {/* Header with ID and status */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            #{_id.slice(-6).toUpperCase()}
          </h3>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
              {packageType}
            </span>
          </div>
        </div>

        {/* Package image */}
        <div className="mb-4">
          {renderPackageImage()}
        </div>

        {/* Package details */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-1">Contents</p>
          <p className="text-gray-800 line-clamp-2 text-sm">{packageDetails}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-lg">
            <p className="text-xs font-medium text-blue-600">Weight</p>
            <p className="text-sm font-semibold text-gray-800">{packageWeight} kg</p>
          </div>
          {distance && (
            <div className="bg-green-50 p-2 rounded-lg">
              <p className="text-xs font-medium text-green-600">Distance</p>
              <p className="text-sm font-semibold text-gray-800">{distance.toFixed(1)} km</p>
            </div>
          )}
          {cost && (
            <div className="bg-purple-50 p-2 rounded-lg">
              <p className="text-xs font-medium text-purple-600">Cost</p>
              <p className="text-sm font-semibold text-gray-800">${cost.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Location info */}
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Pickup
            </p>
            <p className="text-gray-700 truncate">{pickupLocation?.display_name || 'N/A'}</p>
          </div>
          <div>
            <p className="font-medium text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Delivery
            </p>
            <p className="text-gray-700 truncate">{deliveryLocation?.display_name || 'N/A'}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(createdAt)}
          </div>
          <div className="text-xs space-x-2">
            {
              <span className="text-gray-500">Cust: {customerName?.toString() || 'N/A'}</span>
            }
            {
              <span className="text-gray-500">Driv: {driverName?.toString() || '--'}</span>
            }
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DeliveryComponent;