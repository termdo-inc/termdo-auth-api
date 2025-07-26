import os from "os";
import type { IConstants } from "../interfaces/IConstants.js";

export class ServerConstants implements IConstants {
  public static readonly PORT = 3001;
  public static readonly HOST = os.hostname();
}
