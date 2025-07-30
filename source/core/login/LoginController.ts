import type { ControllerResponse } from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.js";
import type { IController } from "../../app/interfaces/IController.js";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AuthModule } from "../../modules/auth/module.js";
import { LoginManager } from "./LoginManager.js";
import { LoginRequest } from "./schemas/LoginRequest.js";
import type { LoginResponse } from "./schemas/LoginResponse.js";

export class LoginController implements IController {
  public constructor(private readonly manager = new LoginManager()) {}

  public async postLogin(
    req: ExpressRequest,
    res: ControllerResponse<LoginResponse | null, Token | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const request = LoginRequest.parse(req);
      if (request.clientErrors.length > 0 || request.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          request.clientErrors,
          null,
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const out = await this.manager.postLogin(request.data);
      // >-----------< RESPONSE >-----------<
      if (!out.httpStatus.isSuccess() || out.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          out.httpStatus,
          out.serverError,
          out.clientErrors,
          out.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        await AuthModule.instance.generate({ accountId: out.data.accountId }),
      );
    } catch (error) {
      return next(error);
    }
  }
}
