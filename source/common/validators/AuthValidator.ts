import type { Token } from "../../@types/tokens.js";
import { TokenConstants } from "../../app/constants/TokenConstants.js";
import type { IValidator } from "../../app/interfaces/IValidator.js";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.js";

export class AuthValidator implements IValidator {
  public static validate(data: Token, validationErrors: ClientError[]): void {
    if (!data.startsWith(TokenConstants.HEADER_PREFIX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_AUTHORIZATION_HEADER));
    }
    const token: unknown = data.split(" ")[1];
    if (typeof token !== "string") {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_AUTHORIZATION_HEADER));
    }
  }
}
