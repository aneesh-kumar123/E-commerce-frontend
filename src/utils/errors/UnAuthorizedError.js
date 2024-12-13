import BaseError from "./BaseError";

export default class UnAuthorizedError extends BaseError {
  constructor(specificMessage) {
    super(401, specificMessage, "UnAuthorizedError", "Unauthorized Request");
  }
}
