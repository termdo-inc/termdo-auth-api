import type { IModule } from "../../app/interfaces/IModule.js";
import { AuthHandler } from "./core/AuthHandler.js";

export class AuthModule implements IModule {
  private static sInstance: AuthModule | null = null;

  public static get instance(): AuthModule {
    AuthModule.sInstance ??= new AuthModule();
    return AuthModule.sInstance;
  }

  private constructor(private readonly handler = new AuthHandler()) {
    this.verify = this.handler.verify.bind(this.handler);
    this.getPayload = AuthHandler.getPayload.bind(AuthHandler);
    this.generate = AuthHandler.generate.bind(AuthHandler);
    this.refresh = AuthHandler.refresh.bind(AuthHandler);
  }

  public readonly verify: AuthHandler["verify"];
  public readonly getPayload: typeof AuthHandler.getPayload;
  public readonly generate: typeof AuthHandler.generate;
  public readonly refresh: typeof AuthHandler.refresh;
}
