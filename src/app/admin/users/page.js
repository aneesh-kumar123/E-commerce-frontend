'use client';

import React, { useState, useEffect } from 'react';
import { getAllUsersService, deleteUserService, updateUserService, getUserByIdService, addUserService } from '../../../lib/user/userService';
import Table from '../../../components/Table';
import toast from 'react-hot-toast';
import Pagination from '@/components/Pagination';
import SizeBar from '@/components/SizeBar';
import { FaSearch } from 'react-icons/fa';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: ''
  });

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, [limit, page]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsersService(limit, page);
      if (response && response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);  // Set the initial filtered list
        setTotalUsers(response.total);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleSearch = () => {
    const filteredData = users.filter((user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  // const handleAddUserSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await addUserService(newUser);
  //     if (response) {
  //       toast.success("User added successfully!");
  //       fetchUsers();
  //       setIsAddUserModalOpen(false);
  //       setNewUser({ firstName: '', lastName: '', username: '', email: '' });
  //     }
  //   } catch (error) {
  //     toast.error("Failed to add user");
  //   }
  // };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserService(selectedUser.id, selectedUser);
      if (response) {
        toast.success("User updated successfully!");
        fetchUsers();
        setIsUpdateModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserService(selectedUser.id);
      toast.success("User deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleViewUser = async (id) => {
    try {
      const response = await getUserByIdService(id);
      setSelectedUser(response);
      setIsViewModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-red-700 to-red-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white rounded-lg p-4 shadow-lg">
        {/* <div className="flex justify-between mb-4">
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add New User
          </button>
        </div> */}

        {/* Search Section */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Users"
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
        </div>

        {/* Users Table */}
        <Table
          data={filteredUsers}
          requiredColumns={["id", "firstName", "lastName", "username", "dateOfBirth", "city", "email"]}
          isAdmin={true}
          onView={handleViewUser}
          onEdit={(user) => { setSelectedUser(user); setIsUpdateModalOpen(true); }}
          onDelete={(user) => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
        />

        <div className="flex justify-between items-center mt-4">
          <SizeBar setLimit={setLimit} />
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <Modal
          title="Add New User"
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={handleAddUserSubmit}
          user={newUser}
          setUser={setNewUser}
        />
      )}

      {/* Update User Modal */}
      {isUpdateModalOpen && (
        <Modal
          title="Update User"
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleEditSubmit}
          user={selectedUser}
          setUser={setSelectedUser}
        />
      )}

      {/* View User Modal */}
      {isViewModalOpen && (
        <Modal
          title="User Details"
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
      )}

      {/* Delete User Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400">
                No
              </button>
              <button onClick={handleDeleteUser} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
