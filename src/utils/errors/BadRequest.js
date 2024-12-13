import BaseError from "./BaseError";

export default class BadRequest extends BaseError {
  constructor(specificMessage) {
    super(400, specificMessage, "BadRequest", "Invalid Request");
  }
}
