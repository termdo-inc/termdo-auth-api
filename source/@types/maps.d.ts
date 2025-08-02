import type { ClientErrorCode } from "../app/schemas/ClientError.js";
import type { HttpStatusCode } from "../app/schemas/HttpStatus.js";

export type HttpStatusCodeMap<T> = Record<HttpStatusCode, T>;

export type ClientErrorCodeMap<T> = Record<ClientErrorCode, T>;
