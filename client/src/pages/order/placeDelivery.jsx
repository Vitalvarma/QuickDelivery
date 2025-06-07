import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDeliveryStore from '../../stores/deliveryStore';
import * as z from 'zod';

// Define validation schema
const deliverySchema = z.object({
  packageDetails: z.string().min(5, "Package details must be at least 5 characters"),
  pickupLocation: z.string().min(5, "Pickup location must be at least 5 characters"),
  deliveryLocation: z.string().min(5, "Delivery location must be at least 5 characters"),
  packageWeight: z.number().min(0.1, "Weight must be at least 0.1 kg").max(50, "Maximum weight is 50 kg"),
  packageType: z.enum(['document', 'parcel', 'food', 'medicine', 'other']),
});

const DeliveryOrderForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(deliverySchema)
  });

  const { createDelivery,loading } = useDeliveryStore();

  const handleFormSubmit = async (data) => {
    try {
      await createDelivery(data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (

    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">New Delivery Order</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Package Details */}
        <div>
          <label htmlFor="packageDetails" className="block text-sm font-medium text-gray-700">
            Package Details *
          </label>
          <textarea
            id="packageDetails"
            {...register("packageDetails")}
            rows={3}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.packageDetails ? 'border-red-500' : 'border'}`}
            placeholder="Describe what's being delivered (e.g., '2 boxes of electronics')"
          />
          {errors.packageDetails && (
            <p className="mt-1 text-sm text-red-600">{errors.packageDetails.message}</p>
          )}
        </div>

        {/* Pickup Location */}
        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
            Pickup Location *
          </label>
          <input
            type="text"
            id="pickupLocation"
            {...register("pickupLocation")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.pickupLocation ? 'border-red-500' : 'border'}`}
            placeholder="Full address for pickup"
          />
          {errors.pickupLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>
          )}
        </div>

        {/* Delivery Location */}
        <div>
          <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">
            Delivery Location *
          </label>
          <input
            type="text"
            id="deliveryLocation"
            {...register("deliveryLocation")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.deliveryLocation ? 'border-red-500' : 'border'}`}
            placeholder="Full address for delivery"
          />
          {errors.deliveryLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.deliveryLocation.message}</p>
          )}
        </div>

        {/* Package Weight */}
        <div>
          <label htmlFor="packageWeight" className="block text-sm font-medium text-gray-700">
            Package Weight (kg) *
          </label>
          <input
            type="number"
            id="packageWeight"
            step="0.1"
            {...register("packageWeight", { valueAsNumber: true })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.packageWeight ? 'border-red-500' : 'border'}`}
            placeholder="Estimated weight in kilograms"
          />
          {errors.packageWeight && (
            <p className="mt-1 text-sm text-red-600">{errors.packageWeight.message}</p>
          )}
        </div>

        {/* Package Type */}
        <div>
          <label htmlFor="packageType" className="block text-sm font-medium text-gray-700">
            Package Type *
          </label>
          <select
            id="packageType"
            {...register("packageType")}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.packageType ? 'border-red-500' : 'border'}`}
          >
            <option value="">Select package type</option>
            <option value="document">Document</option>
            <option value="parcel">Parcel</option>
            <option value="food">Food</option>
            <option value="medicine">Medicine</option>
            <option value="other">Other</option>
          </select>
          {errors.packageType && (
            <p className="mt-1 text-sm text-red-600">{errors.packageType.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Place Delivery Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryOrderForm;