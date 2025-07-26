import type { TokenPayload } from "../../@types/tokens.js";
import type { ExpressResponse } from "../../@types/wrappers.js";
import { LocalsConstants } from "../constants/LocalsConstants.js";
import type { IHelper } from "../interfaces/IHelper.js";
import { UnexpectedAuthError } from "../schemas/ServerError.js";

export class PayloadHelper implements IHelper {
  public static getPayload<T>(res: ExpressResponse<T>): TokenPayload {
    const local: unknown = res.locals[LocalsConstants.TOKEN_PAYLOAD];
    if (!PayloadHelper.isValidPayload(local)) {
      throw new UnexpectedAuthError();
    }
    return local;
  }
  public static isValidPayload(obj: unknown): obj is TokenPayload {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const payload = obj as TokenPayload;
    return typeof payload.accountId === "number";
  }
}
