'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderById, getOrderItemByOrderId } from '@/lib/user/order';
import { getProductById } from '@/lib/admin/products';
import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('User not authenticated. Redirecting to login.');
          router.push('/login');
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const data = await getOrderById(userId);
        console.log("The order we got:", data);
        setOrders(data.rows || []);
      } catch (error) {
        toast.error('Failed to fetch order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const handleViewOrderItems = async (orderId) => {
    setLoadingItems(true);
    try {
      const data = await getOrderItemByOrderId(orderId);

      // Fetch product details for each order item
      const itemsWithProductDetails = await Promise.all(
        data.map(async (item) => {
          const product = await getProductById(item.productId);
          return {
            ...item,
            productName: product.name, // Add product name from fetched product
            totalPrice: item.quantity * parseFloat(item.priceAtOrder), // Calculate total price
          };
        })
      );

      setSelectedOrderItems(itemsWithProductDetails);
      setIsModalOpen(true); // Open the modal
      toast.success('Order items loaded successfully.');
    } catch (error) {
      toast.error('Failed to load order items.');
    } finally {
      setLoadingItems(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderItems([]);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading your orders...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-indigo-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>

      {orders.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Order Status</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Payment Method</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="bg-indigo-800 text-white hover:bg-indigo-700">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.orderStatus}</td>
                <td className="border border-gray-300 px-4 py-2">${order.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">{order.paymentMethod}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleViewOrderItems(order.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    View Items
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-gray-300 text-center">No orders found.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-3/4 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Close
            </button>
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">#</th>
                  <th className="border border-gray-300 px-4 py-2">Product Name</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.productName}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2">${item.priceAtOrder}</td>
                    <td className="border border-gray-300 px-4 py-2">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
