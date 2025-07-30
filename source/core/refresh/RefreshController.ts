import type { ControllerResponse } from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.js";
import { PayloadHelper } from "../../app/helpers/PayloadHelper.js";
import type { IController } from "../../app/interfaces/IController.js";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AuthModule } from "../../modules/auth/module.js";

export class RefreshController implements IController {
  public async getRefresh(
    _: ExpressRequest,
    res: ControllerResponse<null, Token | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< AUTHORIZATION >----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        new HttpStatus(HttpStatusCode.OK),
        null,
        [],
        null,
        await AuthModule.instance.refresh(payload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
