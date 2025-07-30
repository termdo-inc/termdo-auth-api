import type { ClientErrorCode } from "../app/schemas/ClientError.js";
import type { HttpStatusCode } from "../app/schemas/HttpStatus.js";

export type HttpStatusCodeMap<T> = {
  [key in HttpStatusCode]: T;
};

export type ClientErrorCodeMap<T> = {
  [key in ClientErrorCode]: T;
};
