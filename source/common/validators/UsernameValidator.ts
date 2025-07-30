import type { IValidator } from "../../app/interfaces/IValidator.js";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.js";
import { StringUtil } from "../../app/utils/StringUtil.js";
import { AccountRules } from "../rules/AccountRules.js";

export class UsernameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        AccountRules.USERNAME_MIN_LENGTH,
        AccountRules.USERNAME_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_USERNAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, AccountRules.USERNAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_USERNAME_CONTENT));
    }
  }
}
