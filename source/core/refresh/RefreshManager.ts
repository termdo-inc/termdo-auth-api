import type { ManagerResponse } from "../../@types/responses.js";
import type { TokenPayload } from "../../@types/tokens.js";
import type { IManager } from "../../app/interfaces/IManager.js";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.js";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AccountEntity } from "../../common/entities/AccountEntity.js";
import { RefreshProvider } from "./RefreshProvider.js";
import { RefreshResponse } from "./schemas/RefreshResponse.js";

export class RefreshManager implements IManager {
  public constructor(private readonly provider = new RefreshProvider()) {}

  public async getRefresh(
    payload: TokenPayload,
  ): Promise<ManagerResponse<RefreshResponse | null>> {
    const account = await this.provider.getAccount(payload.accountId);
    if (account === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.FORBIDDEN),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_NOT_FOUND)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      RefreshResponse.fromEntity(new AccountEntity(account)),
    );
  }
}
