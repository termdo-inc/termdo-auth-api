import type { PoolClient } from "pg";
import type { ProviderResponse } from "../../@types/responses.js";
import { DbConstants } from "../../app/constants/DbConstants.js";
import type { IProvider } from "../../app/interfaces/IProvider.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AccountModel } from "../../common/models/AccountModel.js";
import { AccountProvider } from "../../common/providers/AccountProvider.js";
import { AccountQueries } from "../../common/queries/AccountQueries.js";
import { DbModule } from "../../modules/db/module.js";

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
    let client: PoolClient | null = null;
    try {
      client = await DbModule.instance.getClient();
      const results = await client.query(AccountQueries.INSERT_ACCOUNT_RT_$UNAME_$PSWRD, [
        username,
        password,
      ]);
      const record: unknown = results.rows[0];
      return await ResponseUtil.providerResponse(client, AccountModel.fromRecord(record));
    } catch (error) {
      await client?.query(DbConstants.ROLLBACK);
      throw error;
    } finally {
      client?.release();
    }
  }
}
