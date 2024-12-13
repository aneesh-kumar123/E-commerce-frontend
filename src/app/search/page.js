'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getProducts } from '@/lib/admin/products'; // Import the function to fetch products
import { updateProductToCart } from "@/lib/user/cart";
import BuyNowModal from '@/components/BuyNowModal';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

const SearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // To read query parameters from the URL
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(!!decoded); // If token is valid, user is logged in
      } catch (error) {
        setIsLoggedIn(false); // Invalid token
      }
    } else {
      setIsLoggedIn(false); // No token, user is not logged in
    }
  }, []);

  // Function to fetch products based on the search query
  const fetchProducts = async (filters) => {
    try {
      const productsData = await getProducts(9, 1, filters); // 9 is the limit, 1 is the page number
      setProducts(productsData.data);
    } catch (error) {
      toast.error('Failed to fetch products.');
    }
  };

  useEffect(() => {
    // Get the search query from the URL
    const nameFilter = searchParams.get('query') || '';
    // Fetch products with the current search query
    fetchProducts({ name: nameFilter });
  }, [searchParams]);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const token = localStorage.getItem('token');
    const userId = jwtDecode(token).id;

    try {
      await updateProductToCart(userId, product.id, 1); // Add 1 quantity
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add product to cart:', error.message);
      toast.error('Failed to add product to cart.');
    }
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setSelectedProduct(product);
    setIsBuyNowModalOpen(true);
  };

  const closeBuyNowModal = () => {
    setSelectedProduct(null);
    setIsBuyNowModalOpen(false);
  };

  const proceedToBuyNow = (product, quantity) => {
    setIsBuyNowModalOpen(false); // Close modal
    router.push(`/user/buynow?productId=${product.id}&quantity=${quantity}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">Search Results</h1>

      {/* Display Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.image ? product.image : '/default-image.jpg'}
                alt={product.name}
                className="w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                <p className="font-bold text-lg text-gray-800 mt-4">${product.price}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-gray-500">No products found with this name.</p>
        )}
      </div>

      {isBuyNowModalOpen && (
        <BuyNowModal
          isOpen={isBuyNowModalOpen}
          onClose={closeBuyNowModal}
          product={selectedProduct}
          onContinue={proceedToBuyNow}
        />
      )}
    </div>
  );
};

export default SearchPage;
