'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByIdService, updateUserService } from '../../lib/user/userService';
import toast from 'react-hot-toast';
import { FaUserEdit } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the token and decode it to get the user ID
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect if no token
    } else {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      
      // Fetch the user data
      getUserByIdService(userId)
        .then((data) => {
          setUserData(data);
          setUpdatedData(data); // Store original data for updating
          setLoading(false);
        })
        .catch((error) => {
          toast.error('Failed to fetch user data');
          setLoading(false);
        });
    }
  }, [router]);

  // Handle input changes for the editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not logged in!');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.id;

      // Determine the updated fields to send
      const updatedFields = Object.keys(updatedData).filter(
        (key) => updatedData[key] !== userData[key] // Only send fields that have been updated
      );

      // Send each updated field individually with the format { parameter, value }
      for (const field of updatedFields) {
        await updateUserService(userId, { parameter: field, value: updatedData[field] });
      }

      toast.success('Profile updated successfully!');
      setUserData(updatedData); // Update the displayed profile with the new data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      toast.error('Failed to update profile');
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 text-white">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      <div className="bg-white text-black rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white">
            {userData.profileImage ? (
              <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
            ) : (
              <FaUserEdit />
            )}
          </div>
        </div>

        <div className="text-center mb-6">
          {/* Display the username below the profile image */}
          <h2 className="text-xl font-semibold">{userData.username}</h2>
        </div>

        {!editMode ? (
          <>
            <div className="mb-4">
              <strong>Username:</strong> {userData.username}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {userData.email}
            </div>
            <div className="mb-4">
              <strong>Full Name:</strong> {userData.fullName}
            </div>
            <div className="mb-4">
              <strong>Date of Birth:</strong> {userData.dateOfBirth}
            </div>
            <div className="mb-4">
              <strong>Address:</strong> {userData.address}
            </div>
            <div className="mb-4">
              <strong>City:</strong> {userData.city}
            </div>

            <button
              onClick={() => setEditMode(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block">Username</label>
              <input
                type="text"
                name="username"
                value={updatedData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block">Email</label>
              <input
                type="email"
                name="email"
                value={updatedData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={updatedData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={updatedData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block">Address</label>
              <input
                type="text"
                name="address"
                value={updatedData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block">City</label>
              <input
                type="text"
                name="city"
                value={updatedData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
