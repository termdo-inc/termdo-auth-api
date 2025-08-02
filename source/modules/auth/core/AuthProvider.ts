import type { IProvider } from "../../../app/interfaces/IProvider.js";
import { AccountProvider } from "../../../common/providers/AccountProvider.js";

export class AuthProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccount = this.accountProvider.getAccount.bind(
      this.accountProvider,
    );
  }

  public readonly getAccount: AccountProvider["getAccount"];
}
