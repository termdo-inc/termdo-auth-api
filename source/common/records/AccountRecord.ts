/* eslint-disable camelcase */
import type { IModel } from "../../app/interfaces/IModel.js";

export class AccountRecord implements IModel {
  protected constructor(
    public readonly account_id: number,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static isValidRecord(data: unknown): data is AccountRecord {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    if (
      !("account_id" in data) ||
      !("username" in data) ||
      !("password" in data)
    ) {
      return false;
    }
    const model = data as AccountRecord;
    return (
      typeof model.account_id === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string"
    );
  }

  public static areValidRecords(data: unknown[]): data is AccountRecord[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidRecord(item));
  }
}
