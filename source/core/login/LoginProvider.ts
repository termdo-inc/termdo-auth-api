import type { IProvider } from "../../app/interfaces/IProvider.js";
import { AccountProvider } from "../../common/providers/AccountProvider.js";

export class LoginProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccountByUsername = this.accountProvider.getAccountByUsername.bind(
      this.accountProvider,
    );
  }

  public readonly getAccountByUsername: typeof this.accountProvider.getAccountByUsername;
}
