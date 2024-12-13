'use client'
import { useState, useEffect } from 'react';
import { getProductsByCategoryId } from '../../../lib/admin/products';  // Import the getProducts function
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { updateProductToCart } from "@/lib/user/cart";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import BuyNowModal from "@/components/BuyNowModal"; 

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [selectedProduct, setSelectedProduct] = useState(null);
    const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
    // const router = useRouter();

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("categoryId we get here is", categoryId)
        const data = await getProductsByCategoryId( { categoryId });
        console.log("category response", data)  // Fetch products with categoryId filter
        setProducts(data.data);  // Assuming data is in 'data' field
        setLoading(false);
      } catch (err) {
        setError('Error fetching products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

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

  // Handle the "Buy Now" click event
  // const handleBuyNow = (productId) => {
  //   // Buy now logic goes here (e.g., redirecting to checkout)
  //   toast.info("Redirecting to checkout...");
  // };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
};

export default ProductsPage;
