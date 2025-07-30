import os from "os";
import type { IConfig } from "../interfaces/IConfig.js";

export class AppConfig implements IConfig {
  public static readonly HOST = os.hostname();
  public static readonly PORT = parseInt(process.env["APP_PORT"] as string);
}
