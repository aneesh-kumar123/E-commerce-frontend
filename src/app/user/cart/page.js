"use client";

import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { getCartByUserId, clearCart, updateProductToCart } from "@/lib/user/cart";
import { getProductById } from "@/lib/admin/products";
import toast from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch userId from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return null;
    }
    const decoded = jwtDecode(token);
    return decoded.id; // Assumes `id` exists in the token payload
  };

  // Fetch cart items and populate product details
  useEffect(() => {
    const fetchCart = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const items = await getCartByUserId(userId);

        // Fetch product details for each cart item
        const detailedCartItems = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            return { ...item, ...product }; // Merge cart item with product details
          })
        );

        setCartItems(detailedCartItems);
      } catch (error) {
        console.error("Failed to fetch cart items:", error.message);
        toast.error("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle clearing the cart
  const handleClearCart = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      await clearCart(userId);
      setCartItems([]); // Clear cart items in the UI
      toast.success("Cart cleared successfully!");
    } catch (error) {
      console.error("Failed to clear cart:", error.message);
      toast.error("Failed to clear cart.");
    }
  };

  // Handle quantity update
  const handleUpdateQuantity = async (productId, quantityChange) => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const cartItem = cartItems.find((item) => item.productId === productId);
    const newQuantity = cartItem.quantity + quantityChange;

    if (newQuantity < 1) {
      // Automatically remove the item from the cart if quantity becomes 0
      try {
        await updateProductToCart(userId, productId, -cartItem.quantity); // Remove item completely
        setCartItems((prev) => prev.filter((item) => item.productId !== productId));
        toast.success(`${cartItem.name} removed from cart!`);
      } catch (error) {
        console.error("Failed to remove item from cart:", error.message);
        toast.error("Failed to remove item from cart.");
      }
      return;
    }

    try {
      await updateProductToCart(userId, productId, quantityChange); // Call backend to update quantity
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update cart:", error.message);
      toast.error("Failed to update cart.");
    }
  };

  // Calculate total price for all items
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Handle Checkout
  const handleCheckout = () => {
    router.push("/user/checkout"); // Navigate to checkout page
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-white">Your Cart</h1>

      {loading ? (
        <div className="text-center">
          <p className="text-lg text-gray-200">Loading cart items...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center flex flex-col items-center">
          <FaShoppingCart className="text-6xl text-gray-400 mb-4" /> {/* Shopping cart icon */}
          <p className="text-xl font-semibold text-gray-300">Your cart is empty.</p>
          <p className="text-gray-400 mt-2">Start adding items to your cart to see them here.</p>
        </div>
      ) : (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border border-gray-500 p-4 rounded-lg shadow-md bg-gray-800"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || "/default-image.jpg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{item.name}</h2>
                    <p className="text-sm text-gray-300">Price: ${item.price}</p>
                    <p className="text-sm text-gray-300">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-semibold text-white mb-2">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, -1)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Total Price: ${calculateTotalPrice()}
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleClearCart}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
