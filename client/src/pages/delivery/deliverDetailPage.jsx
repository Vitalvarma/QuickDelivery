import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDeliveryStore from '../../stores/deliveryStore';
import useAuthStore from '../../stores/authStore';
import {toast} from 'react-hot-toast'

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDelivery, loading, error, getDeliveryById, updateDelivery, deleteDelivery } = useDeliveryStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      getDeliveryById(id);
    }
  }, [id, getDeliveryById]);

  const handleDelivery =async ()=>{
    try{
      await updateDelivery(id, { deliveryStatus: "delivered" });
      navigate("/deliveries");
      toast.success("Package delivered successfully");
    }
    catch{
      toast.error("Failed to deliver package");
    }
    //need to write the code
  }

  const handleSubmitFeedback = async () => {
    const rating = prompt("Enter the rating for this delivery (1-5):");
    const feedback = prompt("Enter your feedback for this delivery:");
    
    if (!rating || !feedback) return;
    
    try {
      await updateDelivery(id, { 
        deliveryStatus: "completed",
        deliveryRating: parseInt(rating),
        feedback 
      });
      navigate("/deliveries");
      toast.success("Feedback submitted successfully");
    } catch{
      toast.error("Failed to submit feedback");
    }
  };

  const handleAcceptDelivery = async () => {
    if (!currentDelivery) return;
    try {
      await updateDelivery(currentDelivery._id, { 
        deliveryStatus: 'inprogress', // Changed from status to deliveryStatus
      });
      navigate("/deliveries");
      toast.success("Delivery accepted successfully");
    } catch {
      toast.error("Failed to accept delivery");
    }
  };

  const handleCancelDelivery = async () => {
    if (!currentDelivery) return;
    try {
      await updateDelivery(currentDelivery._id, { 
        deliveryStatus: 'pending', // Changed from status to deliveryStatus
      });
      navigate("/deliveries");
      toast.success("Delivery cancelled successfully");
    } catch (error) {
      console.error("Error cancelling delivery:", error);
      toast.error("Failed to cancel delivery");
    }
  };

  const handleDeleteDelivery = async () => {
    if (!currentDelivery) return;
    
    try {
      await deleteDelivery(currentDelivery._id);
      navigate('/deliveries');
      toast.success("Delivery deleted successfully");
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error loading delivery: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDelivery) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No delivery found</h3>
        <p className="mt-1 text-gray-500">The requested delivery could not be found.</p>
      </div>
    );
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
    deliveryFeedback,
    createdAt,
    updatedAt,
  } = currentDelivery;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (deliveryStatus) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      inprogress: 'bg-blue-100 text-blue-800',
      delivered: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusLabels = {
      pending: 'Pending',
      inprogress: 'In Progress',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[deliveryStatus] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[deliveryStatus] || deliveryStatus}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delivery #{_id.slice(-6).toUpperCase()}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detailed information about this delivery
              </p>
            </div>
            <div>
              {getStatusBadge(deliveryStatus)}
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Package Information</h4>
              <dl className="space-y-4">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Details</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{packageDetails}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{packageType}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{packageWeight} kg</dd>
                </div>
              </dl>
            </div>
            
            <div className="sm:col-span-1">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
              <dl className="space-y-4">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customerId ? customerId.toString() : 'N/A'}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Driver ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{driverId ? driverId.toString() : 'Not assigned'}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {deliveryRating !== null && deliveryRating !== undefined ? (
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < deliveryRating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    ) : 'Not rated'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="sm:col-span-1">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Pickup Information</h4>
              <dl className="space-y-4">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{pickupLocation}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(createdAt)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="sm:col-span-1">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Delivery Information</h4>
              <dl className="space-y-4">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{deliveryLocation}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(updatedAt)}</dd>
                </div>
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Feedback</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {deliveryFeedback || (
                      <span className="text-gray-400">No feedback provided</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">

          {user?.role === 'driver' && deliveryStatus === 'pending' && (
            <button
              onClick={handleAcceptDelivery}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Accept Delivery
            </button>
          )}
          
          {user?.role === 'driver' && deliveryStatus === 'inprogress' && (
            <>
              <button
                onClick={handleCancelDelivery}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Delivery
              </button>
              <button
                onClick={handleDelivery}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Delivered
              </button>
            </>
          )}
          
          {user?.role === 'customer' && deliveryStatus === 'delivered' && (
            <button
              onClick={handleSubmitFeedback}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Feedback
            </button>
          )}
          
          {user?.role === 'customer' && deliveryStatus === 'pending' && (
            <button
              onClick={handleDeleteDelivery}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;