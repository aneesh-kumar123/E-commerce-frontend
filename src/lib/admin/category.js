import axios from "axios";

const apiUrl = 'http://localhost:5000/api/v1/category'; 


export const getCategories = async (limit,page,filters) => {
  try {
    let token = localStorage.getItem("token");
    const queryParams = new URLSearchParams({
      limit,
      page,
      ...filters,
    }).toString();

    if(limit===undefined  && page===undefined && filters===undefined){
      const response = await axios.get(`${apiUrl}`);
      return response.data;

    }
   
    const response = await axios.get(`${apiUrl}?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};


export const createCategory = async (categoryData) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    console.log("Creating category:", categoryData);
    const response = await axios.post(apiUrl, categoryData,{
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};


export const updateCategory = async (categoryId, categoryData) => {
  try {
    console.log("the category id is", categoryId)
    console.log("Updating category:", categoryData)
    
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.put(`${apiUrl}/${categoryId}`, categoryData,{
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};


export const deleteCategory = async (categoryId) => {
  try {
    console.log("Deleting category:", categoryId);
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    const response = await axios.delete(`${apiUrl}/${categoryId}`,{
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not found");
    }
    const response = await axios.get(`${apiUrl}/${categoryId}`,{
      headers: {
        auth: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

export const uploadCategoryCSV = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    // const tokenData = await verifyToken();
    // const clientId = tokenData.id;
    const url = `http://localhost:5000/api/v1/csv-category/upload`;

    // Log FormData before sending to check it's populated
    formData.forEach((value, key) => {
      console.log(`Sending FormData: ${key} =, value`); // Logs the file object properly
      if (value instanceof File) {
        console.log("File details:", {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      }
    });

    const response = await axios.post(url, formData, {
      headers: {
        auth: `Bearer ${token}`,
        // No need to set Content-Type manually, axios will handle it
      },
    });

    return response;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    throw error;
  }
};
