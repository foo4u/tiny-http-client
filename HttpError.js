'use strict';

class HttpError extends Error {
  constructor(message, response) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
    this.response = response;
  }
}

module.exports = HttpError;
