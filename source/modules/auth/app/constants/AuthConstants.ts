import type { Secret } from "jsonwebtoken";
import type { IConstants } from "../../../../app/interfaces/IConstants.js";

export class AuthConstants implements IConstants {
  public static readonly JWT_SECRET = process.env["APP_SECRET"] as Secret;
  public static readonly TOKEN_EXPIRATION_TIME = "60m";
}
