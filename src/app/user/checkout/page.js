"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import { getCartByUserId ,clearCart} from "@/lib/user/cart";
import { getProductById } from "@/lib/admin/products";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { createOrder } from "@/lib/user/order";
// import { getCartByUserId, clearCart, updateProductToCart } from "@/lib/user/cart";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cardInfo, setCardInfo] = useState({
    cvc: "",
    expiry: "",
    name: "",
    number: "",
  });
  const [focus, setFocus] = useState("");

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

  // Fetch cart items and calculate total price
  useEffect(() => {
    const fetchCart = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const items = await getCartByUserId(userId);
        console.log('items:', items);

        // Fetch product details for each cart item
        const detailedCartItems = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            return { ...item, ...product }; // Merge cart item with product details
          })
        );
        console.log('detailedCartItems:', detailedCartItems);


        setCartItems(detailedCartItems);

        // Calculate total price
        const total = detailedCartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(total.toFixed(2));
      } catch (error) {
        console.error("Failed to fetch cart items:", error.message);
        toast.error("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);



  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return;
    }
  
    const userId = jwtDecode(token).id; // Decode the userId from token
    const orderStatus = "Processing"; // Example order status
    const paymentStatus = "Paid"; // Example payment status
    const paymentMethod = "Credit Card"; // Example payment method
  
    try {
      const order = await createOrder(userId, orderStatus, paymentStatus, paymentMethod);
      toast.success("Order placed successfully!");
      await clearCart(userId);
      console.log("Order created: ", order);
  
      router.push("/user/home"); // Redirect to user home after successful payment
    } catch (error) {
      console.error("Failed to create order: ", error.message);
      toast.error("Failed to place order.");
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (e) => {
    setFocus(e.target.name);
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Checkout</h1>

      {loading ? (
        <div className="text-center">
          <p className="text-lg text-gray-500">Loading your cart summary...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center flex flex-col items-center">
          <p className="text-xl font-semibold text-gray-500">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Order Summary</h2>
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between text-left text-white">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">${item.price * item.quantity}</p>
                </li>
              ))}
            </ul>
            <hr className="my-4 border-gray-700" />
            <div className="flex justify-between font-bold text-lg text-white">
              <p>Total Price:</p>
              <p>${totalPrice}</p>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Payment Details</h2>
            <Cards
              cvc={cardInfo.cvc}
              expiry={cardInfo.expiry}
              name={cardInfo.name}
              number={cardInfo.number}
              focused={focus}
              locale={{ valid: "VALID THRU" }}
              placeholders={{ name: "YOUR NAME" }}
              preview={true}
              issuer="visa" // Example: Visa
              styles={{
                card: {
                  backgroundColor: "red", // Custom background color for the card
                },
              }}
            />
            <form className="mt-6 space-y-4">
              <input
                type="text"
                name="number"
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Card Number"
                value={cardInfo.number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              <input
                type="text"
                name="name"
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Name on Card"
                value={cardInfo.name}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
              <div className="flex space-x-4">
                <input
                  type="text"
                  name="expiry"
                  className="w-1/2 p-2 border border-gray-700 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="MM/YY"
                  value={cardInfo.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
                <input
                  type="text"
                  name="cvc"
                  className="w-1/2 p-2 border border-gray-700 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="CVC"
                  value={cardInfo.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                />
              </div>
              <button
                type="button"
                onClick={handlePayment}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md w-full"
              >
                Pay Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
