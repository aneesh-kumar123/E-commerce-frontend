'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaBox, FaTags, FaUsers, FaClipboardList } from 'react-icons/fa'; // Icons
import { useRouter } from 'next/navigation'; // To navigate programmatically
import { getCategories } from '../../lib/admin/category';
import { getProducts } from '@/lib/admin/products';
import { getAllUsersService } from '../../lib/user/userService';
import { getAllorders } from '@/lib/user/order';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    users: 0,
    orders: 0,
  });

  const router = useRouter();

  const fetchCategoryCount = async () => {
    try {
      const data = await getCategories();
      const categoriesCount = data.total;
      setStats((prevStats) => ({
        ...prevStats,
        categories: categoriesCount,
      }));
    } catch (error) {
      toast.error('Failed to fetch category count');
    }
  };

  const fetchProductCount = async () => {
    try {
      const data = await getProducts();
      const productsCount = data.total;
      setStats((prevStats) => ({
        ...prevStats,
        products: productsCount,
      }));
    } catch (error) {
      toast.error('Failed to fetch product count');
    }
  };

  const fetchUsersCount = async () => {
    try {
      const data = await getAllUsersService();
      const usersCount = data.total;
      setStats((prevStats) => ({
        ...prevStats,
        users: usersCount,
      }));
    } catch (error) {
      toast.error('Failed to fetch users count');
    }
  };

  const fetchOrderCount = async () => {
    try {
      const data = await getAllorders();
      const ordersCount = data.total;
      setStats((prevStats) => ({
        ...prevStats,
        orders: ordersCount,
      }));
    } catch (error) {
      toast.error('Failed to fetch orders count');
    }
  };

  useEffect(() => {
    fetchCategoryCount();
    fetchProductCount();
    fetchUsersCount();
    fetchOrderCount();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Products Card */}
        <div
          onClick={() => router.push('/admin/products')}
          className="cursor-pointer bg-red-600 text-white p-6 rounded-xl shadow-lg text-center hover:bg-red-700"
        >
          <FaBox className="text-4xl mb-4" />
          <h3 className="text-xl">Products</h3>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>

        {/* Categories Card */}
        <div
          onClick={() => router.push('/admin/categories')}
          className="cursor-pointer bg-yellow-600 text-white p-6 rounded-xl shadow-lg text-center hover:bg-yellow-700"
        >
          <FaTags className="text-4xl mb-4" />
          <h3 className="text-xl">Categories</h3>
          <p className="text-3xl font-bold">{stats.categories}</p>
        </div>

        {/* Users Card */}
        <div
          onClick={() => router.push('/admin/users')}
          className="cursor-pointer bg-green-600 text-white p-6 rounded-xl shadow-lg text-center hover:bg-green-700"
        >
          <FaUsers className="text-4xl mb-4" />
          <h3 className="text-xl">Users</h3>
          <p className="text-3xl font-bold">{stats.users}</p>
        </div>

        {/* Orders Card */}
        <div
          onClick={() => router.push('/admin/orders')}
          className="cursor-pointer bg-blue-600 text-white p-6 rounded-xl shadow-lg text-center hover:bg-blue-700"
        >
          <FaClipboardList className="text-4xl mb-4" />
          <h3 className="text-xl">Orders</h3>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
      </div>
    </div>
  );
}
