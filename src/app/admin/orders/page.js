'use client';

import React, { useState, useEffect } from 'react';
import { getAllorders } from '@/lib/user/order'; // Import the API service for fetching orders
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import SizeBar from '@/components/SizeBar';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllorders(limit, page); // Fetch orders from the backend
      const responseData = data.data;
      setOrders(responseData);
      setTotalOrders(data.total); // Set the total number of orders for pagination
    } catch (error) {
      toast.error('Failed to fetch orders!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) {
      fetchOrders();
      return;
    }

    const filteredOrders = orders.filter((order) => {
      return (
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setOrders(filteredOrders);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await getAllorders(); // Fetch all orders ignoring pagination
      const allOrders = response.data;

      // Prepare CSV data
      const headers = ['ID', 'User ID', 'Order Status', 'Total Amount', 'Payment Status', 'Payment Method', 'Shipping Address'];
      const rows = allOrders.map((order) => [
        order.id,
        order.userId,
        order.orderStatus,
        order.totalAmount,
        order.paymentStatus,
        order.paymentMethod,
        order.shippingAddress,
      ]);

      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += headers.join(',') + '\n';
      rows.forEach((row) => {
        csvContent += row.join(',') + '\n';
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'orders.csv');
      link.click();
    } catch (error) {
      toast.error('Failed to download orders.');
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders whenever page or limit changes
  }, [page, limit]);

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-red-700 to-red-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Orders"
            className="px-4 py-2 border rounded-md w-1/4 text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <FaSearch /> Search
          </button>
          <button
            onClick={handleDownloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Download CSV
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : (
          <>
            <Table
              data={orders}
              requiredColumns={['id', 'userId', 'orderStatus', 'totalAmount', 'paymentStatus', 'paymentMethod']}
              isAdmin={true} 
              isOrder={true}// Disable edit/delete for this table
              limit={limit}
              page={page}
            
            />

            <div className="flex justify-between items-center mt-4">
              <SizeBar setLimit={setLimit} />
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
