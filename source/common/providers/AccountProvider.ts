import type { ProviderResponse } from "../../@types/responses.js";
import { DbConstants } from "../../app/constants/DbConstants.js";
import type { IProvider } from "../../app/interfaces/IProvider.js";
import { ProtoUtil } from "../../app/utils/ProtoUtil.js";
import { ResponseUtil } from "../../app/utils/ResponseUtil.js";
import { AccountModel } from "../models/AccountModel.js";
import { AccountQueries } from "../queries/AccountQueries.js";

export class AccountProvider implements IProvider {
  public async getAccount(accountId: number): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$ACID, [accountId]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }

  public async getAccountByUsername(
    username: string,
  ): Promise<ProviderResponse<AccountModel | null>> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    try {
      const results = await DbConstants.POOL.query(AccountQueries.GET_ACCOUNT_$UNAME, [username]);
      const record: unknown = results.rows[0];
      if (!ProtoUtil.isProtovalid(record)) {
        return await ResponseUtil.providerResponse(null);
      }
      return await ResponseUtil.providerResponse(AccountModel.fromRecord(record));
    } catch (error) {
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      throw error;
    }
  }
}
