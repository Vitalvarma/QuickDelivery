import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDeliveryStore from '../../stores/deliveryStore';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';

// Define validation schema
const deliverySchema = z.object({
  packageDetails: z.string().min(5, "Package details must be at least 5 characters"),
  pickupLocation: z.string().min(5, "Pickup location must be at least 5 characters"),
  deliveryLocation: z.string().min(5, "Delivery location must be at least 5 characters"),
  packageWeight: z.number().min(0.1, "Weight must be at least 0.1 kg").max(50, "Maximum weight is 50 kg"),
  packageType: z.enum(['document', 'parcel', 'food', 'medicine', 'other']),
});

const PlaceDeliveryForm = () => {
  const navigate=useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(deliverySchema)
  });

  const { createDelivery, loading } = useDeliveryStore();

  const handleFormSubmit = async (data) => {
    try {
      await createDelivery(data);
      navigate('/deliveries')
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">New Delivery</h2>
        <p className="text-gray-600">Fill in the details to schedule your delivery</p>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Package Details */}
        <div className="space-y-2">
          <label htmlFor="packageDetails" className="block text-sm font-medium text-gray-700">
            Package Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="packageDetails"
            {...register("packageDetails")}
            rows={3}
            className={`mt-1 block w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
              errors.packageDetails ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Describe what's being delivered (e.g., '2 boxes of electronics')"
          />
          {errors.packageDetails && (
            <p className="text-sm text-red-500 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              {errors.packageDetails.message}
            </p>
          )}
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Location */}
          <div className="space-y-2">
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pickupLocation"
              {...register("pickupLocation")}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                errors.pickupLocation ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Full address for pickup"
            />
            {errors.pickupLocation && (
              <p className="text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.pickupLocation.message}
              </p>
            )}
          </div>

          {/* Delivery Location */}
          <div className="space-y-2">
            <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">
              Delivery Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="deliveryLocation"
              {...register("deliveryLocation")}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                errors.deliveryLocation ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Full address for delivery"
            />
            {errors.deliveryLocation && (
              <p className="text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.deliveryLocation.message}
              </p>
            )}
          </div>
        </div>

        {/* Weight and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Package Weight */}
          <div className="space-y-2">
            <label htmlFor="packageWeight" className="block text-sm font-medium text-gray-700">
              Package Weight (kg) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="packageWeight"
                step="0.1"
                {...register("packageWeight", { valueAsNumber: true })}
                className={`mt-1 block w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                  errors.packageWeight ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="0.0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
            </div>
            {errors.packageWeight && (
              <p className="text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.packageWeight.message}
              </p>
            )}
          </div>

          {/* Package Type */}
          <div className="space-y-2">
            <label htmlFor="packageType" className="block text-sm font-medium text-gray-700">
              Package Type <span className="text-red-500">*</span>
            </label>
            <select
              id="packageType"
              {...register("packageType")}
              className={`mt-1 block w-full px-4 py-2 rounded-lg border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                errors.packageType ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select package type</option>
              <option value="document">Document</option>
              <option value="parcel">Parcel</option>
              <option value="food">Food</option>
              <option value="medicine">Medicine</option>
              <option value="other">Other</option>
            </select>
            {errors.packageType && (
              <p className="text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.packageType.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Place Delivery'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceDeliveryForm;