import type { MiddlewareResponse } from "../../@types/responses.js";
import type {
  ExpressNextFunction,
  ExpressRequest,
} from "../../@types/wrappers.js";
import { AuthModule } from "../../modules/auth/module.js";
import { LocalConstants } from "../constants/LocalConstants.js";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.js";
import { HeadersUtil } from "../utils/HeadersUtil.js";
import { ResponseUtil } from "../utils/ResponseUtil.js";

export class AuthMiddleware {
  public static verifyAuth() {
    return async (
      req: ExpressRequest,
      res: MiddlewareResponse,
      next: ExpressNextFunction,
    ): Promise<typeof res | void> => {
      try {
        // >----------< VALIDATION >----------<
        const token = HeadersUtil.parseToken(req);
        if (token.clientErrors.length > 0 || token.data === null) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.BAD_REQUEST),
            null,
            token.clientErrors,
          );
        }
        // >-----------< LOGIC >-----------<
        const verificationErrors = await AuthModule.instance.verify(token.data);
        if (verificationErrors.length > 0) {
          return ResponseUtil.middlewareResponse(
            res,
            new HttpStatus(HttpStatusCode.UNAUTHORIZED),
            null,
            verificationErrors,
          );
        }
        // Payload extraction
        const payload = AuthModule.instance.getPayload(token.data);
        // eslint-disable-next-line require-atomic-updates
        res.locals[LocalConstants.TOKEN_PAYLOAD] = payload;
        // >----------< CONTINUE >----------<
        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
