"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
    getProducts,
    createProduct,
    deleteProduct,
    getProductById,
    updateProduct,
} from "../../../lib/admin/products";
import { getCategories, getCategoryById } from "../../../lib/admin/category";
import Table from "../../../components/Table"; // Assuming Table component is shared
import Pagination from "../../../components/Pagination"; // Assuming Pagination component is shared
import SizeBar from "../../../components/SizeBar"; // Assuming SizeBar component is shared
import { FaSearch } from "react-icons/fa";
import photoUrlService from "@/utils/helper/photoUrlService";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalProduct, setTotalProduct] = useState(0);
    const [categories, setCategories] = useState([]);
    const [viewProduct, setViewProduct] = useState(null);
    const [editProduct, setEditProduct] = useState(null);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [deleteProductId, setDeleteProductId] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        categoryId: "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const router = useRouter();

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getProducts(limit, page);
            setProducts(data.data);
            setFilteredProducts(data.data);
            setTotalProduct(data.total);
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [limit, page]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // Fetch categories and products
    //             await fetchCategories();
    //             await fetchProducts();

    //             // After fetching both categories and products, map categoryId to categoryName
    //             const updatedProducts = products.map((product) => ({
    //                 ...product,
    //                 categoryName: categories.find((category) => category.id === product.categoryId)?.name || 'Unknown', // map categoryId to categoryName
    //             }));

    //             // Update filteredProducts with the mapped categoryName
    //             setFilteredProducts(updatedProducts);
    //         } catch (error) {
    //             toast.error('Error fetching data');
    //         }
    //     };

    //     fetchData();
    // }, [limit, page, products, categories]);

    useEffect(() => {
        // Only update filteredProducts when both products and categories are available
        if (products.length > 0 && categories.length > 0) {
            const updatedProducts = products.map((product) => ({
                ...product,
                categoryName:
                    categories.find(
                        (category) => category.id === product.categoryId
                    )?.name || "Unknown", // map categoryId to categoryName
            }));
            setFilteredProducts(updatedProducts);
        }
    }, [products, categories]);

    const handleSearch = () => {
        const filteredData = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.price.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filteredData);
    };

    // Handle Create Product
    const handleDownloadCSV = async () => {
        try {
          // Fetch all products data (ignoring pagination here)
          const response = await getProducts();
          const allProducts = response.data;
    
          // Prepare the CSV data
          const headers = ["ID", "Name", "Description", "Price", "Stock Quantity", "Category"];
          const rows = allProducts.map((product) => [
            product.id,
            product.name,
            product.description,
            product.price,
            product.stockQuantity,
            product.categoryId,
          ]);
    
          // Create a CSV string
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += headers.join(",") + "\n";
          rows.forEach((row) => {
            csvContent += row.join(",") + "\n";
          });
    
          // Create a download link for the CSV file
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "products.csv");
          link.click(); // Trigger the download
        } catch (error) {
          toast.error("Failed to download products");
        }
      };


    const handleCreateProduct = async (e) => {
        e.preventDefault();

        // Validate form inputs
        if (
            !newProduct.name ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.stockQuantity ||
            !newProduct.categoryId ||
            !newProduct.image
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: Number(newProduct.price),
                stockQuantity: Number(newProduct.stockQuantity),
                image: newProduct.image, // image as URL string
            };

            const response = await createProduct(
                newProduct.categoryId,
                productData
            );
            if (response) {
                toast.success("Product created successfully!");
                //make prduct data empty
                setNewProduct({
                    name: "",
                    description: "",
                    price: "",
                    stockQuantity: "",
                    categoryId: "",
                    image: "",
                });
                // imagePreview.src = "";
                // imagePreview="";
                setIsCreateModalOpen(false);
                fetchProducts(); // Refresh the products after creation
            }
        } catch (error) {
            toast.error("Failed to create product");
        }
    };

    // Handle Delete Product
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(deleteProductId);
            toast.success("Product deleted successfully!");
            setIsDeleteModalOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    // const handleViewProduct = async (id) => {
    //     try {
    //         // Call your service to get product by id
    //         const response = await getProductById(id);

    //         if (response) {
    //             setViewProduct(response); // Save product details in state
    //             setIsViewModalOpen(true); // Open the modal
    //         } else {
    //             toast.error("Failed to fetch product details.");
    //         }
    //     } catch (error) {
    //         toast.error(error.message || "Failed to fetch product details.");
    //     }
    // };

    const handleViewProduct = async (productId) => {
        try {
            // Fetch product by ID
            const response = await getProductById(productId); // Assuming this API returns product data with categoryId
            const product = response;

            // Fetch category details using categoryId
            const categoryResponse = await getCategoryById(product.categoryId); // Get category by categoryId

            // Map category name to product object
            const updatedProduct = {
                ...product,
                categoryName: categoryResponse?.name || "Unknown", // Add categoryName to product object
            };

            // Set viewProduct with updated information
            setViewProduct(updatedProduct);
            setIsViewModalOpen(true); // Open the modal
        } catch (error) {
            toast.error("Failed to fetch product details.");
        }
    };

    const handleEditProduct = (product) => {
        // Set the product data for editing
        setEditProduct({
            ...product,
            originalName: product.name,
            originalDescription: product.description,
            originalPrice: product.price,
            originalStockQuantity: product.stockQuantity,
            originalCategoryId: product.categoryId,
        });
        setIsUpdateModalOpen(true); // Open the update modal
    };

    const handleUpdateProductSubmit = async (e) => {
        e.preventDefault(); // Prevent form reload

        try {
            // Check if the product data is valid
            if (!editProduct || !editProduct.id) {
                toast.error("Invalid product data.");
                return;
            }

            // Create an array of fields to update dynamically
            const updatedFields = Object.keys(editProduct).filter(
                (key) =>
                    key !== "id" && // Ignore `id` key
                    key !== "originalName" && // Ignore `originalName`
                    key !== "originalDescription" && // Ignore `originalDescription`
                    key !== "originalPrice" && // Ignore `originalPrice`
                    key !== "originalStockQuantity" && // Ignore `originalStockQuantity`
                    key !== "originalCategoryId" && // Ignore `originalCategoryId`
                    key !== "originalImage" && // Ignore `originalImage`
                    editProduct[key] !==
                        editProduct[
                            `original${
                                key.charAt(0).toUpperCase() + key.slice(1)
                            }`
                        ] // Compare with original value
            );

            // If no fields are updated, inform the user and stop the process
            if (updatedFields.length === 0) {
                toast.info("No changes detected.");
                return;
            }

            // Send each updated field one by one (parameter: value)
            for (const parameter of updatedFields) {
                const value = editProduct[parameter]; // Get the updated value
                await updateProduct(editProduct.id, { parameter, value }); // Call the API service with dynamic parameter-value
            }

            toast.success("Product updated successfully!");
            setIsUpdateModalOpen(false); // Close the update modal
            fetchProducts(); // Refresh the product list
        } catch (error) {
            toast.error(error.message || "Failed to update product.");
        }
    };

    // Image handling for preview and upload
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Upload the image file to a service (photoUrlService, replace with your own service)
                const imageUrl = await photoUrlService(file);
                // Assume photoUrlService returns a URL after upload
                console.log("the image url is", imageUrl);
                // Update the state with the image URL (string, not the file object)
                setNewProduct({
                    ...newProduct,
                    image: imageUrl, // Store URL instead of file object
                });

                // Preview the image
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result); // Display the image preview
                };
                reader.readAsDataURL(file); // Convert file to base64 string for preview
            } catch (error) {
                showErrorToast(error); // Show error message if upload fails
            }
        }
    };

    const handleImageChangeEdit = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Assuming `photoUrlService` uploads the image and returns the URL
            photoUrlService(file)
                .then((imageUrl) => {
                    // Update the editProduct state with the new image URL
                    setEditProduct((prevProduct) => ({
                        ...prevProduct,
                        image: imageUrl,
                    }));
                })
                .catch((error) => {
                    toast.error("Failed to upload image.");
                });
        }
    };

    const totalPages = Math.ceil(totalProduct / limit);
    console.log("the view products is,", viewProduct);

    return (
        <div className="p-8 min-h-screen bg-gradient-to-r from-red-700 to-red-600 text-white">
            <h1 className="text-3xl font-bold mb-6">Manage Products</h1>

            {/* Search and Table */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex flex-wrap gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search Products"
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
                    {/* Add the CSV download button */}
                    <button
                        onClick={handleDownloadCSV}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Download CSV
                    </button>
                </div>

                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                    >
                        Add New Product
                    </button>
                </div>

                {/* Products Table */}
                <Table
                    data={filteredProducts}
                    requiredColumns={[
                        "id",
                        "name",
                        "description",
                        "price",
                        "stockQuantity",
                        "categoryName",
                    ]}
                    isAdmin={true}
                    // onEdit={(product) => handleEditProduct(product)}
                    onView={handleViewProduct} // View handler
                    onEdit={handleEditProduct} // Edit handler
                    onDelete={(id) => {
                        setDeleteProductId(id);
                        setIsDeleteModalOpen(true);
                    }}
                    page={page}
                    limit={limit}
                />

                <div className="flex justify-between items-center mt-4">
                    <SizeBar setLimit={setLimit} />
                    <Pagination
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>

            {/* Create Product Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                        <h2 className="text-xl font-semibold mb-4">
                            Create New Product
                        </h2>
                        <form
                            onSubmit={handleCreateProduct}
                            className="max-h-[80vh] overflow-y-auto flex flex-col space-y-4"
                        >
                            {/* Product Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            {/* Price */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            price: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            {/* Stock Quantity */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Stock Quantity
                                </label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={newProduct.stockQuantity}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            stockQuantity: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    name="categoryId"
                                    value={newProduct.categoryId}
                                    onChange={(e) =>
                                        setNewProduct({
                                            ...newProduct,
                                            categoryId: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-md"
                                    required
                                >
                                    <option value="" disabled>
                                        Select Category
                                    </option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Image Upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                    accept="image/*"
                                    required
                                />
                            </div>
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700">
                                        Image Preview:
                                    </h3>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                </div>
                            )}
                            {/* Submit & Cancel Buttons */}
                            <div className="flex justify-between mt-4 space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Create Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Confirm Deletion
                        </h2>
                        <p>Are you sure you want to delete this category?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                No
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isViewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full max-w-md overflow-hidden max-h-[90vh]">
                        <h2 className="text-xl font-semibold mb-4">
                            Product Information
                        </h2>

                        {/* Scrollable content */}
                        <div className="overflow-y-auto max-h-[60vh]">
                            {/* Product Image */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800">
                                    Image:
                                </h3>
                                {viewProduct?.image ? (
                                    <img
                                        src={viewProduct.image}
                                        alt="Product Image"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800">
                                    Name:
                                </h3>
                                <p>{viewProduct?.name || "N/A"}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800">
                                    Description:
                                </h3>
                                <p>{viewProduct?.description || "N/A"}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800">
                                    Price:
                                </h3>
                                <p>{viewProduct?.price || "N/A"}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800">
                                    Stock Quantity:
                                </h3>
                                <p>{viewProduct?.stockQuantity || "N/A"}</p>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800">
                                    Category:
                                </h3>
                                <p>{viewProduct?.categoryName || "N/A"}</p>
                            </div>
                        </div>

                        {/* Close Button (fixed at the bottom of the modal) */}
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

            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Edit Product
                        </h2>

                        {/* Scrollable content */}
                        <div className="overflow-y-auto max-h-[70vh]">
                            <form onSubmit={handleUpdateProductSubmit}>
                                {/* Product Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editProduct?.name || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                {/* Product Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <textarea
                                        value={editProduct?.description || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                {/* Product Price */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        value={editProduct?.price || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                price: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                {/* Stock Quantity */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={editProduct?.stockQuantity || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                stockQuantity: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                {/* Category Display (Selected Category Name) */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <div className="w-full px-4 py-2 border rounded-md bg-gray-100 mb-2">
                                        {editProduct?.categoryName ||
                                            "No category selected"}
                                    </div>

                                    {/* Category Dropdown for Updating */}
                                    <select
                                        value={editProduct?.categoryId || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                categoryId: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-md"
                                    >
                                        <option value="" disabled>
                                            Select Category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Product Image */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleImageChangeEdit} // Image change handler for preview
                                        className="w-full px-4 py-2 border rounded-md"
                                        accept="image/*"
                                    />
                                </div>

                                {/* Image Preview */}
                                {editProduct?.image && (
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-800">
                                            Current Image:
                                        </h3>
                                        <img
                                            src={editProduct?.image} // Show the current image if it's available
                                            alt="Current Product Image"
                                            className="w-32 h-32 object-cover rounded-md"
                                        />
                                    </div>
                                )}

                                {/* Submit & Cancel Buttons */}
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsUpdateModalOpen(false)
                                        }
                                        className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Update Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
