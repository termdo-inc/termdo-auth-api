import type { IModel } from "../app/interfaces/IModel.js";
import type { IParams } from "../app/interfaces/IParams.js";
import type { IQueries } from "../app/interfaces/IQueries.js";
import type { IRequest } from "../app/interfaces/IRequest.js";
import type { IResponse } from "../app/interfaces/IResponse.js";
import type { ClientError } from "../app/schemas/ClientError.js";
import type { HttpStatus } from "../app/schemas/HttpStatus.js";
import type { ServerError } from "../app/schemas/ServerError.js";
import type { Token } from "./tokens.js";
import type { ExpressResponse } from "./wrappers.d.ts";

export type ControllerResponse<
  D extends IResponse | null,
  T extends Token | null,
> = ExpressResponse<{
  host: string;
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
  token: T;
}>;

export interface ParserResponse<
  T extends IRequest | IParams | IQueries | null,
> {
  clientErrors: ClientError[];
  data: T;
}

export type MiddlewareResponse = ControllerResponse<null, null>;

export interface ManagerResponse<D extends IResponse | null> {
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
}

export type ProviderResponse<D extends IModel | boolean | null> = D;
