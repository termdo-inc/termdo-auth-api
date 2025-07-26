import type { IEntity } from "../../app/interfaces/IEntity.js";
import type { AccountModel } from "../models/AccountModel.js";

export class AccountEntity implements IEntity {
  public constructor(public readonly model: AccountModel) {}
}
