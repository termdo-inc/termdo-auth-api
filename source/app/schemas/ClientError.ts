import { AccountRules } from "../../common/rules/AccountRules.js";
import { TokenConstants } from "../constants/TokenConstants.js";
import type { IResponse } from "../interfaces/IResponse.js";

export class ClientError implements IResponse {
  public readonly code: number;
  public readonly message: string;

  public constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Header errors
  MISSING_HEADERS = 10000,
  INVALID_HEADERS = 10001,
  //  *  *  101XX: Body errors
  MISSING_BODY = 10100,
  INVALID_BODY = 10101,
  //  *  *  102XX: Parameter errors
  MISSING_PARAMETER = 10200,
  INVALID_PARAMETER = 10201,
  //  *  *  103XX: Query errors
  MISSING_QUERY = 10300,
  INVALID_QUERY = 10301,
  //  *  2XXXX: Address errors
  //  *  *  200XX: Method errors
  METHOD_NOT_ALLOWED = 20000,

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  INVALID_AUTHORIZATION_HEADER = 30000,
  INVALID_TOKEN = 30001,
  EXPIRED_TOKEN = 30002,
  //  *  4XXXX: Session errors
  //  *  5XXXX: Permission errors

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  INVALID_USERNAME_LENGTH = 60000,
  INVALID_PASSWORD_LENGTH = 60001,
  //  *  7XXXX: Format errors
  INVALID_USERNAME_CONTENT = 70000,
  INVALID_PASSWORD_CONTENT = 70001,

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  ACCOUNT_NOT_FOUND = 80001,
  INCORRECT_PASSWORD = 80002,
  //  *  *  801XX: /signup errors
  FORBIDDEN_ACCOUNT_TYPE = 80100,
  ACCOUNT_ALREADY_EXISTS = 80101,
  //  *  9XXXX: Catch-all errors
  RESOURCE_NOT_FOUND = 90000,
}

const clientErrorMessages: Record<ClientErrorCode, string> = {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Header errors
  [ClientErrorCode.MISSING_HEADERS]: "Request headers were not provided.",
  [ClientErrorCode.INVALID_HEADERS]: "Provided request headers were invalid.",
  //  *  *  101XX: Body errors
  [ClientErrorCode.MISSING_BODY]: "Request body was not provided.",
  [ClientErrorCode.INVALID_BODY]: "Provided request body was invalid.",
  //  *  *  102XX: Parameter errors
  [ClientErrorCode.MISSING_PARAMETER]: "Required parameter was not provided.",
  [ClientErrorCode.INVALID_PARAMETER]: "Provided parameter was invalid.",
  //  *  *  103XX: Query errors
  [ClientErrorCode.MISSING_QUERY]: "Required query was not provided.",
  [ClientErrorCode.INVALID_QUERY]: "Provided query was invalid.",
  //  *  2XXXX: Address errors
  //  *  *  200XX: Method errors
  [ClientErrorCode.METHOD_NOT_ALLOWED]: "Requested method is not allowed.",

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  [ClientErrorCode.INVALID_AUTHORIZATION_HEADER]: `Authorization header was invalid. It must be in the format '${TokenConstants.HEADER_PREFIX}<token>'.`,
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  //  *  4XXXX: Session errors
  //  *  5XXXX: Permission errors

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  [ClientErrorCode.INVALID_USERNAME_LENGTH]: `Username must be between ${AccountRules.USERNAME_MIN_LENGTH} and ${AccountRules.USERNAME_MAX_LENGTH} characters long.`,
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]: `Password must be between ${AccountRules.PASSWORD_MIN_LENGTH} and ${AccountRules.PASSWORD_MAX_LENGTH} characters long.`,
  //  *  7XXXX: Content errors
  [ClientErrorCode.INVALID_USERNAME_CONTENT]:
    "Username must include english letters, numbers, dots, underscores and must not include spaces.",
  [ClientErrorCode.INVALID_PASSWORD_CONTENT]:
    "Password must include at least one lowercase letter, one uppercase letter, one number and one special character.",

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  [ClientErrorCode.ACCOUNT_NOT_FOUND]: "No account was found with the provided phone.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  //  *  *  801XX: /signup errors
  [ClientErrorCode.FORBIDDEN_ACCOUNT_TYPE]: "Provided account type can't be signed up.",
  [ClientErrorCode.ACCOUNT_ALREADY_EXISTS]: "An account already exists with the provided phone.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
