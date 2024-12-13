"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {jwtDecode} from "jwt-decode";
import { getProductById } from "@/lib/admin/products";
import { buyNowOrder } from "@/lib/user/order";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

const BuyNowPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cardInfo, setCardInfo] = useState({
    cvc: "",
    expiry: "",
    name: "",
    number: "",
  });
  const [focus, setFocus] = useState("");

  const productId = searchParams.get("productId");
  const searchQuantity = parseInt(searchParams.get("quantity"), 10);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        setQuantity(searchQuantity || 1);
        setTotalPrice((productData.price * (searchQuantity || 1)).toFixed(2));
      } catch (error) {
        console.error("Failed to fetch product:", error.message);
        toast.error("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [productId, searchQuantity]);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated!");
      return null;
    }
    const decoded = jwtDecode(token);
    return decoded.id; // Assumes `id` exists in the token payload
  };

  const handlePayment = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      await buyNowOrder(userId, product.id, quantity, product.price);
      toast.success("Order placed successfully!");
    //   router.push("/user/order-confirmation");
    router.push("/user/home")
    } catch (error) {
      console.error("Failed to place order:", error.message);
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
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Buy Now</h1>

      {!product ? (
        <div className="text-center">
          <p className="text-lg text-gray-500">Loading product details...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Order Summary</h2>
            <div className="flex justify-between text-left text-white">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-400">Quantity: {quantity}</p>
              </div>
              <p className="font-bold">${totalPrice}</p>
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
              issuer="visa"
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

export default BuyNowPage;
