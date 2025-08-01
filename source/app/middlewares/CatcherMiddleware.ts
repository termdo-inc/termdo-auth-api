import type { MiddlewareResponse } from "../../@types/responses.js";
import type {
  ExpressNextFunction,
  ExpressRequest,
} from "../../@types/wrappers.js";
import type { IMiddleware } from "../interfaces/IMiddleware.js";
import { ClientError, ClientErrorCode } from "../schemas/ClientError.js";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.js";
import { ResponseUtil } from "../utils/ResponseUtil.js";

export class CatcherMiddleware implements IMiddleware {
  public static resourceNotFound(
    _: ExpressRequest,
    res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): typeof res | void {
    try {
      return ResponseUtil.middlewareResponse(
        res,
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.RESOURCE_NOT_FOUND)],
      );
    } catch (error) {
      return next(error);
    }
  }
}
