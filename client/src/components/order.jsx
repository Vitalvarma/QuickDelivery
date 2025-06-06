import React from 'react'

const OrdersComponent = (orderId, status, amount, date) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h1>
      <p className="text-gray-600">Here you can view the details of your order.</p>
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">${orderId}</h2>
            <p className="text-gray-600">Status: ${status}</p>
            <p className="text-gray-600">Total: ${amount}</p>
            <p className="text-gray-600">Date: ${date}</p>
            <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            View Details
            </button>
        </div>
    </div>
  )
}

export default OrdersComponent;
