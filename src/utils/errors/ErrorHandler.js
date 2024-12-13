import BadRequest from "./BadRequest";
import UnAuthorizedError from "./UnAuthorizedError";
import NotFoundError from "./NotFoundError";
import BaseError from "./BaseError";

export const handleAxiosError = (error) => {
  if (error.response) {
    // Log backend response for debugging
    console.log("Backend Response:", error.response);

    const status = error.response.status;
    const specificMessage = error.response.data?.specificMessage; // Extract specificMessage
    const message = error.response.data?.message || "An unexpected error occurred";

    // Map backend error codes to frontend error classes
    switch (status) {
      case 400:
        throw new BadRequest(specificMessage || "Bad Request");
      case 401:
        throw new UnAuthorizedError(specificMessage || "Unauthorized Access");
      case 404:
        throw new NotFoundError(specificMessage || "Resource Not Found");
      default:
        throw new BaseError(
          status,
          specificMessage || message,
          error.response.data?.name || "Error",
          message
        );
    }
  } else if (error.request) {
    // Request made, but no response received
    throw new BaseError(
      500,
      "No response from the server",
      "NetworkError",
      "Failed to communicate with the server"
    );
  } else {
    // Error during request setup
    throw new BaseError(500, error.message, "ClientError", "Unexpected Client Error");
  }
};
