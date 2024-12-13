import axios from "axios";
import { handleAxiosError } from "../../utils/errors/ErrorHandler";

export const LoginUser = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/v1/user/login",
      formData
    );
    return response.data; 
  } catch (error) {
    console.error("Axios Error Response:", error.response); 
    handleAxiosError(error); 
    throw error; 
  }
};
