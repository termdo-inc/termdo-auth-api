import type { IResponse } from "../../../app/interfaces/IResponse.js";
import type { AccountEntity } from "../../../common/entities/AccountEntity.js";

export class LoginResponse implements IResponse {
  public constructor(
    public readonly accountId: number,
    public readonly username: string,
  ) {}

  public static fromEntity(entity: AccountEntity): LoginResponse {
    return new LoginResponse(entity.model.accountId, entity.model.username);
  }

  public static fromEntities(entities: AccountEntity[]): LoginResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
