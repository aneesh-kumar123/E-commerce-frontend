import axios from "axios";

// Base API URL for products
const apiUrl = 'http://localhost:5000/api/v1/product'; 

// Get all products with pagination and filters
export const getProducts = async (limit, page, filters) => {
  try {
    let token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      limit,
      page,
      ...filters,
    }).toString();

    // Check if limit, page and filters are undefined, then fetch all products
    if (limit === undefined && page === undefined && filters === undefined) {
      const response = await axios.get(apiUrl);
      return response.data;
    }

    const response = await axios.get(`${apiUrl}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (categoryId, productData) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    console.log("the categoryId is", categoryId);
    console.log("the productData is", productData);

    // Send product data along with categoryId
    const response = await axios.post(
      `http://localhost:5000/api/v1/category/${categoryId}/product`, 
      productData,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (productId, productData) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    console.log("the productId is", productId);
    console.log("the productData is", productData);

    const response = await axios.put(
      `${apiUrl}/${productId}`,
      productData,
      {
        headers: {
          auth: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (productId) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.delete(`${apiUrl}/${productId}`, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Get product details by product ID
export const getProductById = async (productId) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.get(`${apiUrl}/${productId}`, {
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getProductsByCategoryId = async (categoryId) => {
  try {
    console.log("categoryId", categoryId.categoryId)
    // let token = localStorage.getItem("token");
    // if (!token) {
    //   throw new Error("Token not found");
    // }
    const url = `http://localhost:5000/api/v1/product/category/${categoryId.categoryId}`; 

    const response = await axios.get(url);
    return response.data;
}
  catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}


