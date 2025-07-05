import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useDeliveryStore from '../../stores/deliveryStore';
import useAuthStore from '../../stores/authStore';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import RatingFeedbackPrompt from '../../components/feedbackprompt.controller.jsx';
import OtpPrompt from '../../components/otpprompt.controller.jsx';
import usePaymentStore from '../../stores/paymentStore.js';

const DeliveryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDelivery, loading, error, getDeliveryById, updateDelivery, deleteDelivery, sendOtp, verifyOtp } = useDeliveryStore();
  const { user } = useAuthStore();
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [showOtpPrompt, setShowOtpPrompt] = useState(false);
  const {amount,setAmount}=usePaymentStore();

  useEffect(() => {
    if (id) {
      getDeliveryById(id);
    }
  }, [id, getDeliveryById]);

  useEffect(()=>{
    if(currentDelivery){
      setAmount(currentDelivery.cost)
      }
  }, [currentDelivery, setAmount])

  const handleDelivery = async () => {
    try {
      const isOtpSent = await sendOtp(id);
      if (!isOtpSent) {
        return;
      }
      setShowOtpPrompt(true);
    } catch {
      toast.error("Failed to deliver package");
    }
  };

  const handleOtpConfirm = async (otp) => {
    try {
      const isVerified = await verifyOtp(otp, id);
      if (isVerified) {
        await updateDelivery(id, {
          deliveryStatus: 'delivered',
        });
        navigate("/deliveries");
        toast.success("Delivery marked as delivered successfully");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
    setShowOtpPrompt(false);
  };

  const handleResendOtp = () => {
    try {
      sendOtp(id);
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
    setShowOtpPrompt(true);
  };

  const handleSubmitFeedback = async () => {
    setShowRatingPrompt(true);
  };

  const handleRatingSubmit = async ({ rating, feedback }) => {
    try {
      await updateDelivery(id, {
        deliveryStatus: "completed",
        deliveryRating: parseInt(rating),
        deliveryFeedback: feedback
      });
      setShowRatingPrompt(false);
      navigate("/deliveries");
      toast.success("Feedback submitted successfully");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  const handleAcceptDelivery = async () => {
    if (!currentDelivery) return;
    try {
      await updateDelivery(currentDelivery._id, {
        deliveryStatus: 'inprogress',
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
        deliveryStatus: 'pending',
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
  }
  
  const handlePaymentClick = async () =>{
    if (!currentDelivery) return;
    try {
        navigate(`/payment`);
        
    } catch {
          toast.error("Failed to make payment");
    }
  }

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
      pending: 'bg-amber-100 text-amber-800',
      inprogress: 'bg-blue-100 text-blue-800',
      delivered: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-emerald-100 text-emerald-800',
    };
    
    const statusLabels = {
      pending: 'Pending',
      inprogress: 'In Progress',
      delivered: 'Delivered',
      completed: 'Completed',
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[deliveryStatus] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[deliveryStatus] || deliveryStatus}
      </span>
    );
  };

  const renderProfilePicture = () => {
    if (currentDelivery?.imageUrl) {
      return (
        <img
          className="h-40 w-40 rounded-lg object-cover border-4 border-white shadow-md"
          src={currentDelivery.imageUrl}
          alt="Package"
          style={{ objectPosition: 'center' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '';
          }}
        />
      );
    }
    return (
      <div className="h-40 w-40 rounded-lg bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
        <svg
          className="h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-100 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Error loading delivery</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentDelivery) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center bg-white rounded-xl shadow-sm">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">No delivery found</h3>
        <p className="mt-2 text-gray-600">The requested delivery could not be found.</p>
      </div>
    );
  }

  const {
    _id,
    customerName,
    driverName,
    packageDetails,
    pickupLocation,
    deliveryLocation,
    packageWeight,
    packageType,
    deliveryStatus,
    deliveryRating,
    deliveryFeedback,
    paymentStatus,
    distance,
    cost,
    createdAt,
    updatedAt,
  } = currentDelivery;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Delivery #{_id.slice(-6).toUpperCase()}
                </h2>
                <p className="mt-1 text-indigo-100">
                  Detailed information about this delivery
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                {getStatusBadge(deliveryStatus)}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="px-6 py-8">
            {/* Package Image */}
            <div className="flex justify-center mb-10">
              <div className="relative">
                {renderProfilePicture()}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-2 shadow-lg">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                    {packageType}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Package Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <svg className="inline-block w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Package Details
                </h3>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{packageDetails}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Weight</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">{packageWeight} kg</dd>
                  </div>
                  {distance && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Distance</dt>
                      <dd className="text-sm font-medium text-gray-900 text-right">{distance.toFixed(2)} km</dd>
                    </div>
                  )}
                  {cost && (
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Cost</dt>
                      <dd className="text-sm font-medium text-gray-900 text-right">${cost.toFixed(2)}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Customer Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <svg className="inline-block w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer Information
                </h3>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                    <dd className="text-sm font-medium text-indigo-600 text-right">{customerName ? customerName.toString() : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-500">Rating</dt>
                    <dd className="text-sm font-medium text-gray-900 text-right">
                      {deliveryRating !== null && deliveryRating !== undefined ? (
                        <div className="flex items-center justify-end">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < deliveryRating ? 'text-yellow-500' : 'text-gray-300'}`}
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

              {/* Driver Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <svg className="inline-block w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Driver Information
                </h3>
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Driver Name</dt>
                    <dd className="text-sm font-medium text-indigo-600 text-right">{driverName ? driverName.toString() : 'Not assigned'}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pickup Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <svg className="inline-block w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pickup Information
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                    <dd className="text-sm text-gray-900">{pickupLocation?.display_name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Created</dt>
                    <dd className="text-sm text-gray-900">{formatDate(createdAt)}</dd>
                  </div>
                </dl>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  <svg className="inline-block w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                  </svg>
                  Delivery Information
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                    <dd className="text-sm text-gray-900">{deliveryLocation?.display_name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Last Updated</dt>
                    <dd className="text-sm text-gray-900">{formatDate(updatedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-1">Feedback</dt>
                    <dd className="text-sm text-gray-900">
                      {deliveryFeedback || (
                        <span className="text-gray-400 italic">No feedback provided</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-end gap-3">
            {user?.role === 'driver' && deliveryStatus === 'pending' && (
              <button
                onClick={handleAcceptDelivery}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
              >
                Accept Delivery
              </button>
            )}
            
            {user?.role === 'driver' && deliveryStatus === 'inprogress' && (
              <>
                <button
                  onClick={handleCancelDelivery}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel Delivery
                </button>
                <button
                  onClick={handleDelivery}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Mark as Delivered
                </button>
              </>
            )}
            
            {user?.role === 'customer' && deliveryStatus === 'delivered'&& paymentStatus==='paid' &&(
              <button
                onClick={handleSubmitFeedback}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                Submit Feedback
              </button>
            )}
            
            {user?.role === 'customer' && deliveryStatus === 'pending' && (
              <button
                onClick={handleDeleteDelivery}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
              >
                Delete Delivery
              </button>
            )}

            {user?.role === 'customer' && deliveryStatus === 'delivered' && paymentStatus==='paid'&& (
              <button disabled={true}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200">
                  PAID
              </button>
            )}

            {
              user?.role === 'customer' && deliveryStatus === 'delivered' && paymentStatus==='pending'&&(
                <button
                onClick={handlePaymentClick}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                pay {(amount / 100).toFixed(2)}
              </button>
              )
            }
          </div>
        </div>
      </div>

      {/* Modals */}
      <OtpPrompt
        isOpen={showOtpPrompt}
        onConfirm={handleOtpConfirm}
        onCancel={() => setShowOtpPrompt(false)}
        onResend={handleResendOtp}
      />
      <RatingFeedbackPrompt
        isOpen={showRatingPrompt}
        onConfirm={handleRatingSubmit}
        onCancel={() => setShowRatingPrompt(false)}
      />
    </div>
  );
};

export default DeliveryDetails;