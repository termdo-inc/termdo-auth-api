import type { MiddlewareResponse } from "../../@types/responses.js";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.js";
import { Method } from "../enums/Method.js";
import { RouteHelper } from "../helpers/RouteHelper.js";
import type { IMiddleware } from "../interfaces/IMiddleware.js";
import { ClientError, ClientErrorCode } from "../schemas/ClientError.js";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.js";
import { UnexpectedMethodError } from "../schemas/ServerError.js";
import { ResponseUtil } from "../utils/ResponseUtil.js";

export class MethodMiddleware implements IMiddleware {
  public static methodNotAllowed(
    req: ExpressRequest,
    res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): typeof res | void {
    try {
      const routeMethods = RouteHelper.getMethods(req.originalUrl);
      if (routeMethods === null) {
        return next();
      }
      if (!Object.values(Method).includes(req.method.toUpperCase() as Method)) {
        throw new UnexpectedMethodError(req.method);
      }
      if (!routeMethods.includes(req.method as Method)) {
        return ResponseUtil.middlewareResponse(
          res,
          new HttpStatus(HttpStatusCode.METHOD_NOT_ALLOWED),
          null,
          [new ClientError(ClientErrorCode.METHOD_NOT_ALLOWED)],
        );
      } else {
        return next();
      }
    } catch (error) {
      return next(error);
    }
  }
}
