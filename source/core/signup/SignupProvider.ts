import type { ProviderResponse } from "../../@types/responses.js";
import { DbConstants } from "../../app/constants/DbConstants.js";
import type { IProvider } from "../../app/interfaces/IProvider.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AccountModel } from "../../common/models/AccountModel.js";
import { AccountProvider } from "../../common/providers/AccountProvider.js";
import { AccountQueries } from "../../common/queries/AccountQueries.js";

export class SignupProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccountByUsername = this.accountProvider.getAccountByUsername.bind(
      this.accountProvider,
    );
  }

  public readonly getAccountByUsername: typeof this.accountProvider.getAccountByUsername;

  public async createAccount(
    username: string,
    password: string,
  ): Promise<ProviderResponse<AccountModel>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AccountQueries.INSERT_ACCOUNT_RT_$UNAME_$PSWRD, [
        username,
        password,
      ]);
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
