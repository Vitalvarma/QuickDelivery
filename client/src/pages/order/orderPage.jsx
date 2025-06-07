import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useDeliveryStore from '../../stores/deliveryStore';
import useAuthStore from '../../stores/authStore';

const OrderPage = () => {
  const { orderId } = useParams();
  const { currentDelivery, loading, error, getDeliveryById, updateDelivery, deleteDelivery } = useDeliveryStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (orderId) {
      getDeliveryById(orderId);
    }
  }, [orderId, getDeliveryById]);

  const handleAccept = async () => {
    if (!currentDelivery) return;
    try {
      await updateDelivery(currentDelivery._id, { deliveryStatus: 'in-progress' });
      alert('Delivery accepted.');
    } catch {
      alert('Failed to accept delivery.');
    }
  };

  const handleCancel = async () => {
    if (!currentDelivery) return;
    try {
      await deleteDelivery(currentDelivery._id);
      alert('Delivery cancelled.');
    } catch {
      alert('Failed to cancel delivery.');
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading delivery details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  if (!currentDelivery) {
    return <div className="p-6 text-center text-gray-600">No delivery found.</div>;
  }

  const {
    _id,
    customerId,
    driverId,
    packageDetails,
    pickupLocation,
    deliveryLocation,
    packageWeight,
    packageType,
    deliveryStatus,
    deliveryRating,
    feedback,
    createdAt,
    updatedAt,
  } = currentDelivery;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p><span className="font-semibold">Order ID:</span> {_id}</p>
          <p><span className="font-semibold">Customer ID:</span> {customerId ? customerId.toString() : 'N/A'}</p>
          <p><span className="font-semibold">Driver ID:</span> {driverId ? driverId.toString() : 'N/A'}</p>
          <p><span className="font-semibold">Package Details:</span> {packageDetails}</p>
          <p><span className="font-semibold">Pickup Location:</span> {pickupLocation}</p>
          <p><span className="font-semibold">Delivery Location:</span> {deliveryLocation}</p>
          <p><span className="font-semibold">Package Weight:</span> {packageWeight} kg</p>
        </div>
        <div>
          <p><span className="font-semibold">Package Type:</span> {packageType}</p>
          <p><span className="font-semibold">Delivery Status:</span> {deliveryStatus}</p>
          <p><span className="font-semibold">Delivery Rating:</span> {deliveryRating !== null ? deliveryRating : 'Not rated'}</p>
          <p><span className="font-semibold">Feedback:</span> {feedback || 'No feedback'}</p>
          <p><span className="font-semibold">Created At:</span> {formatDate(createdAt)}</p>
          <p><span className="font-semibold">Updated At:</span> {formatDate(updatedAt)}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        {user?.role === 'delivery' && deliveryStatus === 'pending' && (
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Accept Delivery
          </button>
        )}
        {user?.role === 'customer' && deliveryStatus === 'in-progress' && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel Delivery
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
