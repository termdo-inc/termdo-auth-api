import { Router } from "express";
import { Method } from "../../app/enums/Method.js";
import { RouteType } from "../../app/enums/RouteType.js";
import { RouteHelper } from "../../app/helpers/RouteHelper.js";
import type { IBuilder } from "../../app/interfaces/IBuilder.js";
import { SignupController } from "./SignupController.js";

export class SignupBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/signup";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new SignupController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: SignupBuilder.BASE_ROUTE, route: "/" },
      RouteType.AUTHENTICATING,
      Method.POST,
      this.controller.postSignup.bind(this.controller),
    );
  }
}
