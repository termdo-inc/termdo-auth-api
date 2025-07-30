import { Router } from "express";
import { Method } from "../../app/enums/Method.js";
import { RouteType } from "../../app/enums/RouteType.js";
import { RouteHelper } from "../../app/helpers/RouteHelper.js";
import type { IBuilder } from "../../app/interfaces/IBuilder.js";
import { RefreshController } from "./RefreshController.js";

export class RefreshBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/refresh";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new RefreshController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: RefreshBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getRefresh.bind(this.controller),
    );
  }
}
