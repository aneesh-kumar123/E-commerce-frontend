import { toast } from "react-toastify";

export const showSuccessToast = (message) => {
  toast.success(message, { autoClose: 3000 });
};

export const showErrorToast = (message) => {
  toast.error(message,{ autoClose: 3000 });
};

