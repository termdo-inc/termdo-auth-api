import type { ControllerResponse } from "../../@types/responses.js";
import type { Token } from "../../@types/tokens.js";
import type { FullRoute, Pair } from "../../@types/utils.js";
import type {
  ExpressNextFunction,
  ExpressRequest,
  ExpressRouter,
} from "../../@types/wrappers.js";
import { Method } from "../enums/Method.js";
import { RouteType } from "../enums/RouteType.js";
import type { IHelper } from "../interfaces/IHelper.js";
import type { IResponse } from "../interfaces/IResponse.js";
import { CorruptedRouteInfoError } from "../schemas/ServerError.js";

export class RouteHelper implements IHelper {
  private static readonly routes = new Map<string, Pair<RouteType, Method[]>>();

  public static buildRoute<D extends IResponse | null, T extends Token | null>(
    router: ExpressRouter,
    fullRoute: FullRoute,
    type: RouteType,
    method: Method,
    handler: (
      req: ExpressRequest,
      res: ControllerResponse<D, T>,
      next: ExpressNextFunction,
    ) => Promise<typeof res | void> | typeof res | void,
  ): void {
    const apiRoute = this.concatRoute(fullRoute);
    if (!RouteHelper.routes.has(apiRoute)) {
      RouteHelper.addRoute(apiRoute, type);
    }
    switch (method) {
      case Method.GET:
        router.get(fullRoute.route, handler);
        RouteHelper.addMethod(apiRoute, Method.GET);
        break;
      case Method.POST:
        router.post(fullRoute.route, handler);
        RouteHelper.addMethod(apiRoute, Method.POST);
        break;
      case Method.PUT:
        router.put(fullRoute.route, handler);
        RouteHelper.addMethod(apiRoute, Method.PUT);
        break;
      case Method.DELETE:
        router.delete(fullRoute.route, handler);
        RouteHelper.addMethod(apiRoute, Method.DELETE);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  public static addRoute(route: string, type: RouteType): void {
    RouteHelper.routes.set(route, [type, []]);
  }

  public static addMethod(route: string, method: Method): void {
    const routeMethods = RouteHelper.routes.get(route);
    if (routeMethods === undefined) {
      throw new CorruptedRouteInfoError(route);
    }
    routeMethods[1].push(method);
  }

  public static getEndpoints(): Promise<string[]> {
    return new Promise((resolve) => {
      const endpoints: string[] = [];
      RouteHelper.routes.forEach(
        (info: Pair<string, Method[]>, route: string) => {
          const methodsList = info[1].map((method) => `'${method}'`).join(", ");
          endpoints.push(
            `Route: '${route}' | Type: ${info[0]} | Methods: [${methodsList}]`,
          );
        },
      );
      resolve(endpoints);
    });
  }

  public static getMethods(url: string): Method[] | null {
    const urlParts = url.split("/");
    let methods: Method[] | null = null;
    for (const [route, info] of this.routes) {
      const routeParts = route.split("/").filter((part) => part !== "");
      if (urlParts.length === routeParts.length) {
        let isMatch = true;
        for (let i = 0; i < urlParts.length; i++) {
          const urlPart = urlParts[i];
          const routePart = routeParts[i]!;
          if (urlPart !== routePart && !routePart.startsWith(":")) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          methods = info[1];
          break;
        }
      }
    }
    return methods;
  }

  private static concatRoute(fullRoute: FullRoute): string {
    return `${fullRoute.baseRoute}${fullRoute.route}`;
  }
}
