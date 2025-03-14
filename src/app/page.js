'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/lib/admin/products';
import { useRouter } from 'next/navigation';

function Page() {
  const [products, setProducts] = useState([]);
  const [isClient, setIsClient] = useState(false); // Ensures hydration
  const router = useRouter();

  // Fetch products on mount
  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      console.log('Fetched products:', productsData); // Debug log
      setProducts(productsData.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    setIsClient(true); // Ensures hydration
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchProducts();
    }
  }, [isClient]);

  const handleLogin = () => {
    router.push('/login');
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
                    onClick={handleLogin}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleLogin}
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
    </div>
  );
}

export default Page;
