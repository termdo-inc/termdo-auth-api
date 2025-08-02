import type { IModule } from "../../app/interfaces/IModule.js";
import { DbHandler } from "./core/DbHandler.js";

export class DbModule implements IModule {
  private static sInstance: DbModule | null = null;

  public static get instance(): DbModule {
    DbModule.sInstance ??= new DbModule();
    return DbModule.sInstance;
  }

  private constructor(private readonly handler = new DbHandler()) {
    this.getClient = this.handler.getClient.bind(this.handler);
  }

  public readonly getClient: DbHandler["getClient"];
}
