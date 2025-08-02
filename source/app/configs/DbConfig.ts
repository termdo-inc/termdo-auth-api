import type { IConfig } from "../interfaces/IConfig.js";

export class DbConfig implements IConfig {
  public static readonly HOST = process.env["DB_HOST"]!;
  public static readonly PORT = parseInt(process.env["DB_PORT"]!, 10);
  public static readonly USER = process.env["DB_USER"]!;
  public static readonly PASSWORD = process.env["DB_PASSWORD"]!;
  public static readonly NAME = process.env["DB_NAME"]!;
}
