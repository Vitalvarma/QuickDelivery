import { useEffect } from 'react';
import OrdersComponent from '../../components/order';
import { Link, Outlet } from 'react-router-dom';
import useAuthStore from '../../stores/authStore.js';
import useDeliveryStore from '../../stores/deliveryStore.js';

const Orders = () => {
  const { user } = useAuthStore();
  const { getCustomerDeliveries, getAllDeliveries, deliveries, loading } = useDeliveryStore();

  useEffect(() => {
    if (user?.role === 'customer') {
      getCustomerDeliveries();
    } else {
      getAllDeliveries();
    }
  }, [user, getCustomerDeliveries, getAllDeliveries]);

  const orders = deliveries;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h1>
      <p className="text-gray-600">Here you can view all your orders.</p>
      {loading ? 
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading orders...</p>
        </div> :
        <div className='grid grid-cols-2 gap-4 p-6 max-w-3xl mx-auto'>
          {orders.map((order) => (
            <Link key={order._id} to={`/dashboard/orders/${order._id}`}>
              <OrdersComponent 
                order={order}
              />
            </Link>
          ))}
        </div>
      }

      {orders.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">You have no orders yet.</p>
      )}
      
      {user?.role === 'customer' && (
        <>
          <p className="text-gray-500 mt-4">You can place a new order.</p>
          <div className="mt-6">
            <Link
              to="create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Place New Order
            </Link>
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
}

export default Orders;
