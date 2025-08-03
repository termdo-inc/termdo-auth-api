import type { IResponse } from "../../../app/interfaces/IResponse.js";
import type { AccountEntity } from "../../../common/entities/AccountEntity.js";

export class RefreshResponse implements IResponse {
  private constructor(public readonly accountId: number) {}

  public static fromEntity(entity: AccountEntity): RefreshResponse {
    return new RefreshResponse(entity.model.accountId);
  }

  public static fromEntities(entities: AccountEntity[]): RefreshResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
