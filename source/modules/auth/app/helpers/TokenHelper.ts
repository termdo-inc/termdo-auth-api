import jwt from "jsonwebtoken";
import type { Token, TokenPayload } from "../../../../@types/tokens.js";
import type { IHelper } from "../../../../app/interfaces/IHelper.js";
import { AuthConstants } from "../constants/AuthConstants.js";

export class TokenHelper implements IHelper {
  public static generateToken(payload: TokenPayload): Token {
    return jwt.sign(payload, AuthConstants.JWT_SECRET, {
      expiresIn: AuthConstants.TOKEN_EXPIRATION_TIME,
    });
  }
}
