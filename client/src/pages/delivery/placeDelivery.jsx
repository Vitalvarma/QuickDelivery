import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useDeliveryStore from '../../stores/deliveryStore';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const LocationSchema = z.object({
  display_name: z.string().min(1, "Please select a valid location"),
  place_id: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180)
});

const deliverySchema = z.object({
  packageDetails: z.string().min(5, "Package details must be at least 5 characters"),
  pickupLocation: LocationSchema,
  deliveryLocation: LocationSchema,
  packageWeight: z.number().min(0.1, "Weight must be at least 0.1 kg").max(50, "Maximum weight is 50 kg"),
  packageType: z.enum(['document', 'parcel', 'food', 'medicine', 'other']),
  packageImage: z.instanceof(FileList).optional()
});

const PlaceDeliveryForm = () => {
  const navigate = useNavigate();
  const { createDelivery, loading } = useDeliveryStore();

  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(deliverySchema)
  });

  const [suggestions, setSuggestions] = useState({
    pickup: [],
    delivery: []
  });
  const [activeField, setActiveField] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("packageImage", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchSuggestions = async (query, type) => {
    if (!query || query.length < 3) {
      setSuggestions(prev => ({ ...prev, [type]: [] }));
      return;
    }

    // Utility to filter unique place_id items
    const uniqueByPlaceId = (arr) => {
      const seen = new Set();
      return arr.filter(item => {
        if (seen.has(item.place_id)) {
          return false;
        }
        seen.add(item.place_id);
        return true;
      });
    };

    try {
      const response = await axios.get(
        'https://api.locationiq.com/v1/autocomplete', {
          params: {
            key: import.meta.env.VITE_LOCATIONIQ_API_KEY,
            q: query,
            limit: 5
          },
          timeout: 5000
        }
      );

      const mapped = response.data.map(item => ({
        display_name: item.display_name,
        place_id: item.place_id,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));

      const uniqueMapped = uniqueByPlaceId(mapped);

      setSuggestions(prev => ({ ...prev, [type]: uniqueMapped }));
    } catch (error) {
      console.error("API Error:", error);
      setSuggestions(prev => ({ ...prev, [type]: [] }));
    }
  };

  const watchedDisplayName = activeField ? watch(`${activeField}Location.display_name`) : '';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeField) {
        const query = watchedDisplayName || '';
        fetchSuggestions(query, activeField);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedDisplayName, activeField]);

  const handleSelect = (item, type) => {
    setValue(`${type}Location`, item);
    setSuggestions(prev => ({ ...prev, [type]: [] }));
    setActiveField(null);
  };

  const handleFormSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('packageDetails', data.packageDetails);
      formData.append('pickupLocation', JSON.stringify(data.pickupLocation));
      formData.append('deliveryLocation', JSON.stringify(data.deliveryLocation));
      formData.append('packageWeight', data.packageWeight);
      formData.append('packageType', data.packageType);
      if (data.packageImage && data.packageImage[0]) {
        formData.append('imageUrl', data.packageImage[0]);
      }

      console.log(formData);

      await createDelivery(formData);
      navigate('/deliveries');
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg my-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Schedule New Delivery</h2>
        <p className="text-lg text-gray-600">Enter all required details to arrange your delivery</p>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Package Image */}
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Package Image (Optional)
          </label>
          <div className="flex items-center space-x-6">
            <div className="shrink-0">
              {previewImage ? (
                <img className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300" 
                  src={previewImage} 
                  alt="Package preview" 
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
            </div>
            <label className="block">
              <span className="sr-only">Choose package image</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Package Details */}
        <div className="space-y-4">
          <label htmlFor="packageDetails" className="block text-lg font-medium text-gray-700">
            Package Details <span className="text-red-500">*</span>
          </label>
          <textarea
            id="packageDetails"
            {...register("packageDetails")}
            rows={4}
            className={`mt-1 block w-full px-4 py-3 text-lg rounded-xl border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
              errors.packageDetails ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
            }`}
            placeholder="Describe the contents of your package (e.g., '2 boxes of electronics, fragile items')"
          />
          {errors.packageDetails && (
            <p className="text-base text-red-500 flex items-center mt-2">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              {errors.packageDetails.message}
            </p>
          )}
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pickup Location */}
          <div className="space-y-4 relative">
            <label htmlFor="pickupLocation" className="block text-lg font-medium text-gray-700">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="pickupLocation"
                autoComplete="off"
                value={watch("pickupLocation.display_name") || ''}
                onChange={(e) => setValue("pickupLocation.display_name", e.target.value)}
                onFocus={() => setActiveField('pickup')}
                className={`mt-1 block w-full px-4 py-3 text-lg rounded-xl border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                  errors.pickupLocation ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter pickup address"
              />
              {suggestions.pickup.length > 0 && activeField === 'pickup' && (
                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-72 overflow-auto">
                  {suggestions.pickup.map((item) => (
                    <li 
                      key={`pickup-${item.place_id}`}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelect(item, 'pickup')}
                    >
                      <p className="font-medium">{item.display_name.split(',')[0]}</p>
                      <p className="text-sm text-gray-500">{item.display_name.split(',').slice(1).join(',').trim()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.pickupLocation && (
              <p className="text-base text-red-500 flex items-center mt-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.pickupLocation.message}
              </p>
            )}
          </div>

          {/* Delivery Location */}
          <div className="space-y-4 relative">
            <label htmlFor="deliveryLocation" className="block text-lg font-medium text-gray-700">
              Delivery Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="deliveryLocation"
                autoComplete="off"
                value={watch("deliveryLocation.display_name") || ''}
                onChange={(e) => setValue("deliveryLocation.display_name", e.target.value)}
                onFocus={() => setActiveField('delivery')}
                className={`mt-1 block w-full px-4 py-3 text-lg rounded-xl border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                  errors.deliveryLocation ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter delivery address"
              />
              {suggestions.delivery.length > 0 && activeField === 'delivery' && (
                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-xl shadow-xl max-h-72 overflow-auto">
                  {suggestions.delivery.map((item) => (
                    <li 
                      key={`delivery-${item.place_id}`}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelect(item, 'delivery')}
                    >
                      <p className="font-medium">{item.display_name.split(',')[0]}</p>
                      <p className="text-sm text-gray-500">{item.display_name.split(',').slice(1).join(',').trim()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.deliveryLocation && (
              <p className="text-base text-red-500 flex items-center mt-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.deliveryLocation.message}
              </p>
            )}
          </div>
        </div>

        {/* Weight and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Package Weight */}
          <div className="space-y-4">
            <label htmlFor="packageWeight" className="block text-lg font-medium text-gray-700">
              Package Weight (kg) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="packageWeight"
                step="0.1"
                {...register("packageWeight", { valueAsNumber: true })}
                className={`mt-1 block w-full px-4 py-3 text-lg rounded-xl border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                  errors.packageWeight ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="0.0"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">kg</span>
            </div>
            {errors.packageWeight && (
              <p className="text-base text-red-500 flex items-center mt-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.packageWeight.message}
              </p>
            )}
          </div>

          {/* Package Type */}
          <div className="space-y-4">
            <label htmlFor="packageType" className="block text-lg font-medium text-gray-700">
              Package Type <span className="text-red-500">*</span>
            </label>
            <select
              id="packageType"
              {...register("packageType")}
              className={`mt-1 block w-full px-4 py-3 text-lg rounded-xl border-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all ${
                errors.packageType ? 'border-red-400' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <option value="">Select package type</option>
              <option value="document">Document (Letters, Files)</option>
              <option value="parcel">Parcel (Boxes, Packages)</option>
              <option value="food">Food (Perishable Items)</option>
              <option value="medicine">Medicine (Medical Supplies)</option>
              <option value="other">Other (Specify in details)</option>
            </select>
            {errors.packageType && (
              <p className="text-base text-red-500 flex items-center mt-2">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                {errors.packageType.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Schedule Delivery'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceDeliveryForm;