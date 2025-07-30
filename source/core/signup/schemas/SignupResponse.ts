import type { IResponse } from "../../../app/interfaces/IResponse.js";
import type { AccountEntity } from "../../../common/entities/AccountEntity.js";

export class SignupResponse implements IResponse {
  private constructor(
    public readonly accountId: number,
    public readonly username: string,
  ) {}

  public static fromEntity(entity: AccountEntity): SignupResponse {
    return new SignupResponse(entity.model.accountId, entity.model.username);
  }

  public static fromEntities(entities: AccountEntity[]): SignupResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
