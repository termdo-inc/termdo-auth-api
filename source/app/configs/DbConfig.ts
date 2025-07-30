import type { IConfig } from "../interfaces/IConfig.js";

export class DbConfig implements IConfig {
  public static readonly HOST = process.env["POSTGRES_HOST"] as string;
  public static readonly PORT = parseInt(process.env["POSTGRES_PORT"] as string);
  public static readonly USER = process.env["POSTGRES_USER"] as string;
  public static readonly PASSWORD = process.env["POSTGRES_PASSWORD"] as string;
  public static readonly NAME = process.env["POSTGRES_DB"] as string;
}
