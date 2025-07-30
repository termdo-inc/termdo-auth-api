import type { IConstants } from "../interfaces/IConstants.js";

export class DbConstants implements IConstants {
  public static readonly BEGIN = "BEGIN";
  public static readonly COMMIT = "COMMIT";
  public static readonly ROLLBACK = "ROLLBACK";
}
