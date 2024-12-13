'use client'; 

import { useState } from 'react';
import { showErrorToast, showSuccessToast } from "../../utils/helper/toast";
import { toast } from 'react-toastify';
import { RegisterUser } from '../../lib/user/userService'; 
import photoUrlService from '../../utils/helper/photoUrlService'; 
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaEnvelope, FaCalendarAlt, FaUpload, FaEye, FaEyeSlash } from 'react-icons/fa'; 

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    dateOfBirth: '',
    address: '',
    city: '',
    isAdmin: false,
    profileImage: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await photoUrlService(file); 
        setFormData({ ...formData, profileImage: imageUrl });
      } catch (error) {
        // toast.error("Failed to upload image.");
        showErrorToast(error.message || "Failed to upload image.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
     const response= await RegisterUser(formData);
     if (response) {
      showSuccessToast("User added successfully!");
      router.push('/login');
    }
    } catch (error) {
      showErrorToast(error.message || "Failed to add user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-12">
      <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-md">
        
       
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full p-3 pl-10 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your first name"
              required
            />
          </div>
        </div>

        
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full p-3 pl-10 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

     
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full p-3 pl-10 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 pl-10 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your password"
              required
            />
            <div
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

  
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 pl-10 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

      
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            <input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full p-3 pl-10 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <div className="relative">
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your address"
              required
            />
          </div>
        </div>

     
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <div className="relative">
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
              placeholder="Enter your city"
              required
            />
          </div>
        </div>

        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Upload Profile Image</label>
          <div className="relative mb-4">
            <FaUpload className="absolute left-3 top-3 text-gray-400" />
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
            />
            {formData.profileImage && (
              <div className="mt-2 text-xs text-gray-600">Profile Image uploaded successfully!</div>
            )}
          </div>
        </div>

      
        <div className="mb-4">
          <label htmlFor="isAdmin" className="block text-sm font-medium text-gray-700">Are you an Admin?</label>
          <select
            id="isAdmin"
            value={formData.isAdmin}
            onChange={(e) => setFormData({ ...formData, isAdmin: e.target.value === 'true' })}
            className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-700 rounded focus:ring-2 focus:ring-red-500"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

  
        <div className="flex justify-between">
          <button
            type="submit"
            className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <button
            type="button"
            className="w-full p-3 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => router.push('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

