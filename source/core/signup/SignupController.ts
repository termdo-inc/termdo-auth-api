import type { ControllerResponse } from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.js";
import type { IController } from "../../app/interfaces/IController.js";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AuthModule } from "../../modules/auth/module.js";
import { SignupManager } from "./SignupManager.js";
import { SignupRequest } from "./schemas/SignupRequest.js";
import type { SignupResponse } from "./schemas/SignupResponse.js";

export class SignupController implements IController {
  public constructor(private readonly manager = new SignupManager()) {}

  public async postSignup(
    req: ExpressRequest,
    res: ControllerResponse<SignupResponse | null, Token | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const request = SignupRequest.parse(req);
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
      const out = await this.manager.postSignup(request.data);
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
