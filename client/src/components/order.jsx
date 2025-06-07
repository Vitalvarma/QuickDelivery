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
    return date.toLocaleDateString();
  };

  return (
    <Link to={`${_id}`} className="block bg-white shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition">
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <div className="border p-2 rounded">
          <p className="font-semibold">Customer ID</p>
          <p>{customerId ? customerId.toString() : 'N/A'}</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Driver ID</p>
          <p>{driverId ? driverId.toString() : 'N/A'}</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Package Details</p>
          <p>{packageDetails}</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Pickup Location</p>
          <p>{pickupLocation}</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Delivery Location</p>
          <p>{deliveryLocation}</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Package Weight</p>
          <p>{packageWeight} kg</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Package Type</p>
          <p>{packageType}</p>
        </div>
        <div className="border p-2 rounded">
          <p className="font-semibold">Created At</p>
          <p>{formatDate(createdAt)}</p>
        </div>
      </div>
    </Link>
  );
};

export default OrdersComponent;
