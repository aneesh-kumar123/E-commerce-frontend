'use client';

import React, { useState, useEffect } from "react";
import { createCategory, updateCategory, getCategories,deleteCategory ,getCategoryById, uploadEmployeesCSV, uploadCategoryCSV} from "../../../lib/admin/category"; 
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import SizeBar from "../../../components/SizeBar";
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCategory, setTotalCategory] = useState(0);
  const [file,setFile] = useState(null);
  const [showUploadModal,setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const router = useRouter();

  // Modal state for delete and update
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState(null); // Category to edit
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  }); 

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null); 

  const fetchCategories = async () => {
    try {
      const data = await getCategories(limit,page);
      const responsedata = data.data;

      setCategories(responsedata);
      setFilteredCategories(responsedata);
      setTotalCategory(data.total);
    } catch (error) {
      toast.error("Failed to fetch categories!");
    }
  };

  const handleSearch = () => {
    const filteredData = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
     
    );
    setFilteredCategories(filteredData);
  };



  // Add Category
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      const response = await createCategory(newCategory); // Backend API call to add category
      toast.success('Category added successfully!');
      setIsAddCategoryModalOpen(false);
      fetchCategories(); // Refresh the categories list
      setNewCategory({ name: '', description: '' }); // Reset the form
    } catch (error) {
      toast.error(error.message || 'Failed to add category.');
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory({
      ...category,
      originalName: category.name, // Store the original name
      originalDescription: category.description, // Store the original description
    });
    setIsUpdateModalOpen(true); // Open the edit modal
  };
  

  // Update Category
  const handleUpdateCategorySubmit = async (e) => {
    e.preventDefault(); // Prevent form reload

    try {
      if (!editCategory || !editCategory.id) {
        toast.error('Invalid category data.');
        return;
      }

      // Create an array of fields to update dynamically
      const updatedFields = Object.keys(editCategory).filter(
        (key) =>
          key !== 'id' && // Ignore `id` key
          key !== 'originalName' && // Ignore `originalName`
          key !== 'originalDescription' && // Ignore `originalDescription`
          editCategory[key] !== editCategory[`original${key.charAt(0).toUpperCase() + key.slice(1)}`] // Compare with original value
      );

      // If no fields are updated, inform the user and stop the process
      if (updatedFields.length === 0) {
        toast.info('No changes detected.');
        return;
      }

      // Send each updated field one by one (parameter: value)
      for (const parameter of updatedFields) {
        const value = editCategory[parameter]; // Get the updated value
        await updateCategory(editCategory.id, { parameter,value }); // Call the API service
      }

      toast.success('Category updated successfully!');
      setIsUpdateModalOpen(false); // Close the update modal
      fetchCategories(); // Refresh the category list
    } catch (error) {
      toast.error(error.message || 'Failed to update category.');
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(deleteCategoryId); // Backend API call to delete category
      toast.success('Category deleted successfully!');
      setIsDeleteModalOpen(false);
      fetchCategories(); // Refresh the categories list
    } catch (error) {
      toast.error(error.message || 'Failed to delete category.');
    }
  };

 
  const handleViewCategory = async (id) => {
    try {
      const response = await getCategoryById(id, { include: "product" }); // Adjust query params as needed
      if (response) {
        console.log("the response we got on view is", response)

        setViewUser(response); // Save user details in state
        setIsViewModalOpen(true); // Open the modal
      } else {
        // showErrorToast("Failed to fetch user details.");
        toast.error("Failed to fetch user details.");
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch user details.");
    }
  };







  const handleDelete = (categoryId) => {
    setDeleteCategoryId(categoryId);
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleFileChange = (e)=>{
    const seletecFile = e.target.files[0];
    setFile(seletecFile);
  }
  const handleUploadCsv =async () => {
    const formData = new FormData();
    formData.append('file', file);
    for(let pair of formData.entries()){
      console.log("HELLO : ",pair[0],pair[1])
    }

    try {
      const response = await uploadCategoryCSV(formData);
      if(response.status===201){
        setCategories((prevCategories) => [...response.data.data,...prevCategories]);
        setTotalCategory((prevTotal)=>prevTotal+response.data.data.length);
        setShowUploadModal(false); // Close modal
        setShowSuccessModal(true);
        toast.success("CSV uploaded successfully");
      }else{
        setUploadError("Failed to upload the CSV. Please try again.");

      }
    } catch (error) {
      setUploadError("An error occurred during CSV upload.");

      toast.error("Failed to upload CSV");
    }

  }

  

  useEffect(() => {
    fetchCategories();
  }, [limit, page]);

  const totalPages = Math.ceil(totalCategory / limit);
  console.log("filteredCategories", filteredCategories)
  console.log("totalPages", totalPages)

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-red-700 to-red-600 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      <div className="bg-white rounded-lg p-4 shadow-lg">
        {/* Search Bar */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search Categories"
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

        {/* Add New Category Button */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Add New Category
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Employee CSV
          </button>
        </div>

        {/* Table */}
        <Table
          data={filteredCategories}
          requiredColumns={['id','name', 'description']} 
          isAdmin={true}  
          onView={handleViewCategory} 
          onEdit={handleEditCategory} 
          onDelete={handleDelete} 
          page={page}
          limit={limit}
        />

        <div className="flex justify-between items-center mt-4">
          <SizeBar setLimit={setLimit} />
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>

      {/* Add New Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
            <form onSubmit={handleAddCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Category Name"
                  className="w-full px-4 py-2 border rounded-md"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Category Description"
                  className="w-full px-4 py-2 border rounded-md"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Category Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update Category</h2>
            <form onSubmit={handleUpdateCategorySubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editCategory?.name || ""}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editCategory?.description || ""}
                  onChange={(e) =>
                    setEditCategory({ ...editCategory, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

   {isViewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            {/* <h2 className="text-xl font-semibold mb-6 flex items-center justify-center">
              <div className="bg-purple-200 w-16 h-16 rounded-full flex items-center justify-center text-2xl text-purple-800 shadow-lg">
                <i className="fas fa-user"></i>
              </div>
            </h2> */}
            {/* <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {viewUser?.username || "User Name"}
              </h3>
            </div> */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">Category Information:</h3>
              <p> Name: {viewUser?.name || "N/A"}</p>
              <p>Description: {viewUser?.description || "N/A"}</p>
          
              <p>Created At: {viewUser?.createdAt || "N/A"}</p>
              <p>Updated At: {viewUser?.updatedAt || "N/A"}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this category?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeleteCategory}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

{showUploadModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>

            <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
              Upload Category CSV
            </h3>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-2 border mb-4 text-black"
            />

            {uploadError && (
              <p className="text-red-500 text-sm mb-4">{uploadError}</p>
            )}

            <button
              onClick={handleUploadCsv}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full text-center relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-2xl font-semibold text-green-600 mb-4">
              Categories Uploaded Successfully!
            </h3>
            <p className="text-gray-700">The category data has been saved.</p>
          </div>
        </div>
      )}

      
    </div>
  );
}
