import type { ControllerResponse } from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import type {
  ExpressNextFunction,
  ExpressRequest,
} from "../../@types/wrappers.js";
import { PayloadHelper } from "../../app/helpers/PayloadHelper.js";
import type { IController } from "../../app/interfaces/IController.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AuthModule } from "../../modules/auth/module.js";
import { RefreshManager } from "./RefreshManager.js";
import { RefreshResponse } from "./schemas/RefreshResponse.js";

export class RefreshController implements IController {
  public constructor(private readonly manager = new RefreshManager()) {}

  public async getRefresh(
    _: ExpressRequest,
    res: ControllerResponse<RefreshResponse | null, Token | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< AUTHORIZATION >----------<
      const payload = PayloadHelper.getPayload(res);
      // >-----------< LOGIC >-----------<
      const out = await this.manager.getRefresh(payload);
      // >-----------< RESPONSE >-----------<
      if (!out.httpStatus.isSuccess() || out.data === null) {
        return ResponseUtil.controllerResponse(res, { ...out, token: null });
      }
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(res, {
        ...out,
        token: AuthModule.instance.refresh(payload),
      });
    } catch (error) {
      next(error);
    }
  }
}
