import pg from "pg";
import type { IConstants } from "../interfaces/IConstants.js";

export class DbConstants implements IConstants {
  public static readonly POOL = new pg.Pool({
    host: process.env["POSTGRES_HOST"] as string,
    port: parseInt(process.env["POSTGRES_PORT"] as string),
    user: process.env["POSTGRES_USER"] as string,
    password: process.env["POSTGRES_PASSWORD"] as string,
    database: process.env["POSTGRES_DB"] as string,
  });
  public static readonly BEGIN = "BEGIN";
  public static readonly COMMIT = "COMMIT";
  public static readonly ROLLBACK = "ROLLBACK";
}
