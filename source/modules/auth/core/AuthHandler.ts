import jwt from "jsonwebtoken";
import type { Token, TokenPayload } from "../../../@types/tokens.js";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper.js";
import type { IHandler } from "../../../app/interfaces/IHandler.js";
import {
  ClientError,
  ClientErrorCode,
} from "../../../app/schemas/ClientError.js";
import { AuthConstants } from "../app/constants/AuthConstants.js";
import { TokenHelper } from "../app/helpers/TokenHelper.js";
import { AuthProvider } from "./AuthProvider.js";

export class AuthHandler implements IHandler {
  public constructor(private readonly provider = new AuthProvider()) {}

  public async verify(token: Token): Promise<ClientError[]> {
    try {
      const payload = jwt.verify(
        token,
        AuthConstants.JWT_SECRET,
      ) as TokenPayload;
      if (!PayloadHelper.isValidPayload(payload)) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // Try getting the account
      const account = await this.provider.getAccount(payload.accountId);
      // If no account found
      if (account === null) {
        return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
      }
      // Everything ok
      return [];
    } catch (error) {
      // Token error
      if (error instanceof jwt.JsonWebTokenError) {
        if (error instanceof jwt.TokenExpiredError) {
          return [new ClientError(ClientErrorCode.EXPIRED_TOKEN)];
        } else {
          return [new ClientError(ClientErrorCode.INVALID_TOKEN)];
        }
      } else {
        // Unknown error
        throw error;
      }
    }
  }

  /**
   * Call AuthHandler.verify before calling this method.
   */
  public getPayload(token: Token): TokenPayload {
    return jwt.verify(token, AuthConstants.JWT_SECRET) as TokenPayload;
  }

  public async generate(payload: TokenPayload): Promise<Token> {
    return TokenHelper.generateToken(payload);
  }

  public async refresh(payload: TokenPayload): Promise<Token> {
    return await this.generate(payload);
  }
}
