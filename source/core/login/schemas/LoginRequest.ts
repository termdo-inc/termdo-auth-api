import type { ParserResponse } from "../../../@types/responses.js";
import type { ExpressRequest } from "../../../@types/wrappers.js";
import type { IRequest } from "../../../app/interfaces/IRequest.js";
import {
  ClientError,
  ClientErrorCode,
} from "../../../app/schemas/ClientError.js";
import { ProtoUtil } from "../../../app/utils/ProtoUtil.js";
import { ResponseUtil } from "../../../app/utils/ResponseUtil.js";
import { PasswordValidator } from "../../../common/validators/PasswordValidator.js";
import { UsernameValidator } from "../../../common/validators/UsernameValidator.js";

export class LoginRequest implements IRequest {
  public constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static parse(
    req: ExpressRequest,
  ): ParserResponse<LoginRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_BODY)],
        null,
      );
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!LoginRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_BODY)],
        null,
      );
    }
    const blueprintData: LoginRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    UsernameValidator.validate(blueprintData.username, clientErrors);
    PasswordValidator.validate(blueprintData.password, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is LoginRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as LoginRequest;
    return (
      typeof blueprint.username === "string" &&
      typeof blueprint.password === "string"
    );
  }
}
