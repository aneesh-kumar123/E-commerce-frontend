'use client';

import { useRouter } from 'next/navigation'; 
import { useState, useEffect } from 'react';
import { FaSignOutAlt, FaBoxes, FaClipboardList, FaTag, FaUsers, FaUserCircle, FaUserShield } from 'react-icons/fa'; // Added Icons
import { toast } from 'react-hot-toast'; 
import { jwtDecode } from 'jwt-decode'; 
import Link from 'next/link';
import { getUserByIdService } from '../../lib/user/userService';  // Assuming this service is already created for fetching user details

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);  // Store user data

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.isAdmin) {
        setUser(decoded); 
        // Fetch user profile data when admin is logged in
        getUserByIdService(decoded.id)
          .then((data) => setUserData(data))
          .catch(() => toast.error('Failed to fetch profile data'));
      } else {
        router.push('/'); 
      }
    } else {
      router.push('/login'); 
    }
  }, [router]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    router.push('/');
  };

  // Close the profile modal
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  // Navigate to /admin page when the Admin Panel icon/text is clicked
  const navigateToAdminPanel = () => {
    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-red-600 text-white p-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 cursor-pointer" onClick={navigateToAdminPanel}>
          {/* Admin Icon */}
          <FaUserShield className="text-2xl" />
          <span>Admin Panel</span>
        </h2>
        <ul className="space-y-4">
          <li>
            <Link href="/admin/categories" className="flex items-center space-x-2 hover:text-yellow-300">
              <FaTag /> <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="flex items-center space-x-2 hover:text-yellow-300">
              <FaBoxes /> <span>Products</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center space-x-2 hover:text-yellow-300">
              <FaBoxes /> <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="flex items-center space-x-2 hover:text-yellow-300">
              <FaBoxes /> <span>Users</span>
            </Link>
          </li>
          {/* Other admin links (e.g., Users, Orders) */}
        </ul>

        {/* Profile Button - added next to Admin Panel */}
        <div className="mt-6 flex items-center space-x-2 cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
         
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-lg">
            <FaUserCircle />
          </div>
          <span className="text-sm">Admin</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 text-red-300 flex items-center space-x-2 hover:text-yellow-300"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        {children} {/* Render the content here */}
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && userData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md overflow-hidden max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            
            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[60vh]">
              {/* Profile Image */}
              <div className="mb-4 flex flex-col items-center justify-center">
                {/* <h3 className="font-semibold text-gray-800 ">Image:</h3> */}
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile Image"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                ) : (
                  <p>No image available</p>
                )}
                 <p>{userData.username || 'N/A'}</p>
              </div>

              {/* Profile Details */}
              {/* <div className="mb-4">
                <h3 className="font-semibold text-gray-800">UserName:</h3>
                <p>{userData.username || 'N/A'}</p>
              </div> */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">Email:</h3>
                <p>{userData.email || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">Full Name:</h3>
                <p>{userData.fullName || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">Date of Birth:</h3>
                <p>{userData.dateOfBirth || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">Address:</h3>
                <p>{userData.address || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800">City:</h3>
                <p>{userData.city || 'N/A'}</p>
              </div>

              <div className="flex justify-end mt-4">
              <button
                onClick={closeProfileModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
            </div>

            {/* Close Button */}
           
          </div>
        </div>
      )}
    </div>
  );
}
