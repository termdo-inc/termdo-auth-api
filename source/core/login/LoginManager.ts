import type { ManagerResponse } from "../../@types/responses.js";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper.js";
import type { IManager } from "../../app/interfaces/IManager.js";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.js";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AccountEntity } from "../../common/entities/AccountEntity.js";
import { LoginProvider } from "./LoginProvider.js";
import type { LoginRequest } from "./schemas/LoginRequest.js";
import { LoginResponse } from "./schemas/LoginResponse.js";

export class LoginManager implements IManager {
  public constructor(private readonly provider = new LoginProvider()) {}

  public async postLogin(
    request: LoginRequest,
  ): Promise<ManagerResponse<LoginResponse | null>> {
    const account = await this.provider.getAccountByUsername(request.username);
    if (account === null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.NOT_FOUND),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_NOT_FOUND)],
        null,
      );
    }
    if (
      !(await EncryptionHelper.isMatching(request.password, account.password))
    ) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.INCORRECT_PASSWORD)],
        null,
      );
    }
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.OK),
      null,
      [],
      LoginResponse.fromEntity(new AccountEntity(account)),
    );
  }
}
