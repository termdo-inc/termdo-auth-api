import os from "os";
import type { IConfig } from "../interfaces/IConfig.js";

export class ServerConfig implements IConfig {
  public static readonly HOST = os.hostname();
  public static readonly PORT = 3001;
}
