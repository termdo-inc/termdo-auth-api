import type { IModel } from "../../app/interfaces/IModel.js";
import { RecordMismatchError } from "../../app/schemas/ServerError.js";
import { AccountRecord } from "../records/AccountRecord.js";

export class AccountModel implements IModel {
  protected constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static fromRecord(record: unknown): AccountModel {
    if (!AccountRecord.isValidRecord(record)) {
      throw new RecordMismatchError(record);
    }
    return new AccountModel(
      record.account_id,
      record.username,
      record.password,
    );
  }

  public static fromRecords(records: unknown[]): AccountModel[] {
    if (!AccountRecord.areValidRecords(records)) {
      throw new RecordMismatchError(records);
    }
    return records.map(
      (record: unknown): AccountModel => this.fromRecord(record),
    );
  }
}
