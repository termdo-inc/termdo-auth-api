import type { IncomingHttpHeaders } from "http";
import type { ParserResponse } from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import type { ExpressRequest } from "../../@types/wrappers.js";
import { AuthValidator } from "../../common/validators/AuthValidator.js";
import type { IUtil } from "../interfaces/IUtil.js";
import { ClientError, ClientErrorCode } from "../schemas/ClientError.js";
import { ProtoUtil } from "./ProtoUtil.js";
import { ResponseUtil } from "./ResponseUtil.js";

export class HeadersUtil implements IUtil {
  public static parseToken(req: ExpressRequest): ParserResponse<Token | null> {
    const preliminaryData: unknown = req.headers;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_HEADERS)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!HeadersUtil.isBlueprint(protovalidData, "authorization", "string")) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_HEADERS)], null);
    }
    const blueprintData: Token = protovalidData.authorization!;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    AuthValidator.validate(blueprintData, clientErrors);
    const validatedData = blueprintData.split(" ")[1]!;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(
    obj: unknown,
    key: string,
    type: "string" | "string[]",
  ): obj is IncomingHttpHeaders {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    if (
      !Object.entries(obj).every(([key, value]) => {
        if (typeof key !== "string") {
          return false;
        }
        return (
          value === undefined ||
          typeof value === "string" ||
          (Array.isArray(value) && value.every((item) => typeof item === "string"))
        );
      })
    ) {
      return false;
    }
    const blueprint: IncomingHttpHeaders = obj as IncomingHttpHeaders;
    if (!(key.toLowerCase() in blueprint)) {
      return false;
    }
    if (blueprint[key.toLowerCase()] === undefined) {
      return false;
    }
    if (type === "string") {
      return typeof blueprint[key.toLowerCase()] === "string";
    }
    if (type === "string[]") {
      return Array.isArray(blueprint[key.toLowerCase()]);
    }
    return true;
  }
}
