import type { MiddlewareResponse } from "../../@types/responses.js";
import type {
  ExpressNextFunction,
  ExpressRequest,
} from "../../@types/wrappers.js";
import { LogHelper } from "../helpers/LogHelper.js";
import type { IMiddleware } from "../interfaces/IMiddleware.js";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.js";
import { ServerError } from "../schemas/ServerError.js";
import { ResponseUtil } from "../utils/ResponseUtil.js";

export class FailureMiddleware implements IMiddleware {
  public static serverFailure(
    error: Error,
    _: ExpressRequest,
    res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): typeof res | void {
    try {
      LogHelper.failure(`(Server) ${error.name}`, error.message);
      return ResponseUtil.middlewareResponse(
        res,
        new HttpStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
        new ServerError(error),
        [],
      );
    } catch (error2) {
      next(error2);
    }
  }
}
