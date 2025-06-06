import React from 'react'
import OrdersComponent from '../../components/order';
const Orders = () => {
  // Example orders data; replace with real data or props as needed
  const orders = [
    { id: 1, status: 'Delivered', amount: 29.99, date: '2024-06-01' },
    { id: 2, status: 'Processing', amount: 15.50, date: '2024-06-02' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Orders</h1>
      <p className="text-gray-600">Here you can view all your orders.</p>
      {orders.map((order) => (
        <OrdersComponent 
          key={order.id}
          orderId={order.id}
          status={order.status}
          amount={order.amount}
          date={order.date}
        />
      ))}
    </div>
  )
}

export default Orders
