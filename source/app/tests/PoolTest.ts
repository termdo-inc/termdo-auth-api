import { DbConstants } from "../constants/DbConstants.js";
import { LogHelper } from "../helpers/LogHelper.js";
import type { ITest } from "../interfaces/ITest.js";

export class PoolTest implements ITest {
  public static async run(): Promise<void> {
    try {
      await DbConstants.POOL.query(DbConstants.BEGIN);
      await DbConstants.POOL.query(DbConstants.ROLLBACK);
      LogHelper.success("Pool test passed.");
    } catch (error) {
      LogHelper.failure("Error", "Pool test failed.");
      throw error;
    }
  }
}
