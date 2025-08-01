import type { ManagerResponse } from "../../@types/responses.js";
import { EncryptionHelper } from "../../app/helpers/EncryptionHelper.js";
import type { IManager } from "../../app/interfaces/IManager.js";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError.js";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AccountEntity } from "../../common/entities/AccountEntity.js";
import { SignupProvider } from "./SignupProvider.js";
import type { SignupRequest } from "./schemas/SignupRequest.js";
import { SignupResponse } from "./schemas/SignupResponse.js";

export class SignupManager implements IManager {
  public constructor(private readonly provider = new SignupProvider()) {}

  public async postSignup(
    request: SignupRequest,
  ): Promise<ManagerResponse<SignupResponse | null>> {
    if ((await this.provider.getAccountByUsername(request.username)) !== null) {
      return ResponseUtil.managerResponse(
        new HttpStatus(HttpStatusCode.CONFLICT),
        null,
        [new ClientError(ClientErrorCode.ACCOUNT_ALREADY_EXISTS)],
        null,
      );
    }
    const account = await this.provider.createAccount(
      request.username,
      await EncryptionHelper.encrypt(request.password),
    );
    return ResponseUtil.managerResponse(
      new HttpStatus(HttpStatusCode.CREATED),
      null,
      [],
      SignupResponse.fromEntity(new AccountEntity(account)),
    );
  }
}
