import type { IModel } from "../../app/interfaces/IModel.js";
import { ModelMismatchError } from "../../app/schemas/ServerError.js";
import { ProtoUtil } from "../../app/utils/ProtoUtil.js";

export class AccountModel implements IModel {
  protected constructor(
    public readonly accountId: number,
    public readonly username: string,
    public readonly password: string,
  ) {}

  public static fromRecord(record: unknown): AccountModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new AccountModel(record.accountId, record.username, record.password);
  }

  public static fromRecords(records: unknown[]): AccountModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): AccountModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is AccountModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as AccountModel;
    return (
      typeof model.accountId === "number" &&
      typeof model.username === "string" &&
      typeof model.password === "string"
    );
  }

  protected static areValidModels(data: unknown[]): data is AccountModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
