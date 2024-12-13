import axios from "axios";
import { handleAxiosError } from "../../utils/errors/ErrorHandler";

// Get Cart by User ID
export const getCartByUserId = async (userId, query = {}) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");
    console.log("Getting cart for user: ", userId)

    const response = await axios.get(
      `http://localhost:5000/api/v1/cart/${userId}`,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
        params: query, // Optional: Pass additional query params if needed
      }
    );

    console.log("the response is: ", response)
    return response.data; // Return cart items
  } catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to fetch cart.");
  }
};

// Update/Add Product to Cart
export const updateProductToCart = async (userId, productId, quantity) => {
  try {
    console.log("userId: ", userId)
    console.log("productId: ", productId)
    console.log("quantity: ", quantity)
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.put(
      `http://localhost:5000/api/v1/cart/${userId}`,
      {
        productId,
        quantity,
      },
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return updated cart
  } catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to update cart.");
  }
};

// Clear Cart
export const clearCart = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.delete(
      `http://localhost:5000/api/v1/cart/${userId}`,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return success message
  } catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to clear cart.");
  }
};
