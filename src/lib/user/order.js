import axios from "axios";
import { handleAxiosError } from "../../utils/errors/ErrorHandler";

// Create Order
export const createOrder = async (userId, orderStatus, paymentStatus, paymentMethod) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(
      `http://localhost:5000/api/v1/order/${userId}`,
      {
        orderStatus,
        paymentStatus,
        paymentMethod,
      },
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the order response
  } catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to create order.");
  }
};


export const buyNowOrder = async (userId, productId, quantity, priceAtOrder) => {
  try {

    console.log("the user id is", userId);
    console.log("the product id is", productId);
    console.log("the quantity is", quantity);
    console.log("the price at order is", priceAtOrder);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(
      `http://localhost:5000/api/v1/order-item/${userId}`,
      {
        productId,
        quantity,
        priceAtOrder,
      },
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the order response
  }
  catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to create order.");
  }
}

export const getAllorders = async (limit,page, filters) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");
    const queryParams = new URLSearchParams({
      limit,
      page,
      ...filters,
    }).toString();

    if (limit === undefined && page === undefined && filters === undefined) {
      const response = await axios.get("http://localhost:5000/api/v1/orders",{
        headers: { auth: `Bearer ${token}` },
      });
      return response.data;
    }

    const response = await axios.get(
      `http://localhost:5000/api/v1/orders?${queryParams}`,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Return the order response
}
catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to create order.");
  }
}

export const getOrderById = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");
    const response = await axios.get(`http://localhost:5000/api/v1/order/${userId}`,{
      headers: { auth: `Bearer ${token}` },
    });
    console.log("the response here we got in server is", response);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to get order by id.");
  }
}

export const getOrderItemByOrderId = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");
    const response = await axios.get(`http://localhost:5000/api/v1/order-item/${orderId}`,{
      headers: { auth: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
    throw new Error(error.response?.data?.message || "Failed to get order item by order id.");
  }

}
