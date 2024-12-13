"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { getProducts } from '@/lib/admin/products';
import { updateProductToCart } from "@/lib/user/cart";
const {buyNowOrder} = require('@/lib/user/order');
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import BuyNowModal from "@/components/BuyNowModal"; 


function Page() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const router = useRouter();
  // Fetch products on mount
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return null;
    }
    const decoded = jwtDecode(token);
    return decoded.id; // Assumes `id` exists in the token payload
  };

  const handleAddToCart = async (product) => {
    const userId = getUserIdFromToken();
    console.log("userid here is we got", userId)
    if (!userId) return;

    try {
    const response=  await updateProductToCart(userId, product.id, 1); // Add 1 quantity
    console.log(" the response after adding to cart is", response)
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add product to cart:", error.message);
      toast.error("Failed to add product to cart.");
    }
  };


  const handleBuyNow = async (product) => {
    setSelectedProduct(product);
    setIsBuyNowModalOpen(true); 
  }

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
      <h1 className="text-3xl font-semibold text-center mb-8">Featured Products</h1>
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
          <p className="text-center text-lg text-gray-500">No products available.</p>
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
}

export default Page;
