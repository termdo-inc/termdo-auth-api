import type { PoolClient } from "pg";
import { DbModule } from "../../modules/db/module.js";
import { DbConstants } from "../constants/DbConstants.js";
import { LogHelper } from "../helpers/LogHelper.js";
import type { ITest } from "../interfaces/ITest.js";

export class PoolTest implements ITest {
  public static async run(): Promise<void> {
    let client: PoolClient | null = null;
    try {
      client = await DbModule.instance.getClient();
      await client.query(DbConstants.BEGIN);
      await client.query(DbConstants.COMMIT);
      LogHelper.success("Pool test passed.");
    } catch (error) {
      await client?.query(DbConstants.ROLLBACK);
      LogHelper.failure("Error", "Pool test failed.");
      throw error;
    } finally {
      client?.release();
    }
  }
}
