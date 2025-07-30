import type { PoolClient } from "pg";
import type {
  ControllerResponse,
  ManagerResponse,
  MiddlewareResponse,
  ParserResponse,
  ProviderResponse,
} from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import { ServerConfig } from "../configs/ServerConfig.js";
import { DbConstants } from "../constants/DbConstants.js";
import { LogHelper } from "../helpers/LogHelper.js";
import type { IModel } from "../interfaces/IModel.js";
import type { IParams } from "../interfaces/IParams.js";
import type { IQueries } from "../interfaces/IQueries.js";
import type { IRequest } from "../interfaces/IRequest.js";
import type { IResponse } from "../interfaces/IResponse.js";
import type { IUtil } from "../interfaces/IUtil.js";
import type { ClientError } from "../schemas/ClientError.js";
import type { HttpStatus } from "../schemas/HttpStatus.js";
import type { ServerError } from "../schemas/ServerError.js";

export class ResponseUtil implements IUtil {
  public static controllerResponse<
    DO extends IResponse | null,
    TO extends Token | null,
    D extends DO,
    T extends TO,
  >(
    res: ControllerResponse<DO, TO>,
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
    data: D,
    token: T,
    log = true,
  ): typeof res {
    const body = {
      hostName: ServerConfig.HOST,
      httpStatus,
      serverError,
      clientErrors,
      data,
      token,
    };
    if (log) {
      if (body.clientErrors.length > 0) {
        LogHelper.warning("(Client) Errors occurred:");
        body.clientErrors.forEach((error) => {
          LogHelper.detail(`${error.code} - ${error.message}`, 1);
        });
      }
      LogHelper.log("Controller response was:");
      LogHelper.detail(JSON.stringify(body, null, 2), 1);
    }
    return res.status(httpStatus.code).send(body);
  }

  public static parserResponse<T extends IRequest | IParams | IQueries | null>(
    clientErrors: ClientError[],
    data: T,
  ): ParserResponse<T> {
    return {
      clientErrors,
      data,
    };
  }

  public static middlewareResponse(
    res: MiddlewareResponse,
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
  ): typeof res {
    return this.controllerResponse(res, httpStatus, serverError, clientErrors, null, null);
  }

  public static managerResponse<D extends IResponse | null>(
    httpStatus: HttpStatus,
    serverError: ServerError | null,
    clientErrors: ClientError[],
    data: D,
  ): ManagerResponse<D> {
    return {
      httpStatus,
      serverError,
      clientErrors,
      data,
    };
  }

  public static async providerResponse<D extends IModel | boolean | null>(
    client: PoolClient,
    data: D,
    log = false,
  ): Promise<ProviderResponse<D>> {
    await client.query(DbConstants.COMMIT);
    if (log) {
      LogHelper.log("Provider response was:");
      LogHelper.detail(JSON.stringify(data, null, 2), 1);
    }
    return data;
  }
}
