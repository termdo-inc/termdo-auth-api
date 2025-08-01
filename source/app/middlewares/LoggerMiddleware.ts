import type { MiddlewareResponse } from "../../@types/responses.js";
import type {
  ExpressNextFunction,
  ExpressRequest,
} from "../../@types/wrappers.js";
import { LogHelper } from "../helpers/LogHelper.js";
import type { IMiddleware } from "../interfaces/IMiddleware.js";

export class LoggerMiddleware implements IMiddleware {
  public static log(
    req: ExpressRequest,
    _: MiddlewareResponse,
    next: ExpressNextFunction,
  ): void {
    try {
      if (!req.url.startsWith("/_internal")) {
        LogHelper.info(
          `Received a '${req.method}' request on url '${req.url}'.`,
        );
        LogHelper.log("Request headers were:");
        LogHelper.detail(JSON.stringify(req.headers, null, 2), 1);
        LogHelper.log("Request body was:");
        LogHelper.detail(JSON.stringify(req.body, null, 2), 1);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  }
}
