import { Pool, type PoolClient } from "pg";
import { DbConfig } from "../../../app/configs/DbConfig.js";
import type { IHandler } from "../../../app/interfaces/IHandler.js";

export class DbHandler implements IHandler {
  private readonly dbPool = new Pool({
    host: DbConfig.HOST,
    port: DbConfig.PORT,
    user: DbConfig.USER,
    password: DbConfig.PASSWORD,
    database: DbConfig.NAME,
  });

  public async getClient(): Promise<PoolClient> {
    return await this.dbPool.connect();
  }
}
