import { DatabaseConfig } from "../configs/DbConfig.js";
import { LogHelper } from "../helpers/LogHelper.js";
import type { ITest } from "../interfaces/ITest.js";

export class PoolTest implements ITest {
  public static async run(): Promise<void> {
    try {
      await DatabaseConfig.POOL.query(DatabaseConfig.BEGIN);
      await DatabaseConfig.POOL.query(DatabaseConfig.ROLLBACK);
      LogHelper.success("Pool test passed.");
    } catch (error) {
      LogHelper.failure("Error", "Pool test failed.");
      throw error;
    }
  }
}
