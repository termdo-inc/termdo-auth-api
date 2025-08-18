import express, { type Express } from "express";
import { AppConfig } from "./app/configs/AppConfig.js";
import { LogHelper } from "./app/helpers/LogHelper.js";
import { AuthMiddleware } from "./app/middlewares/AuthMiddleware.js";
import { CatcherMiddleware } from "./app/middlewares/CatcherMiddleware.js";
import { FailureMiddleware } from "./app/middlewares/FailureMiddleware.js";
import { LoggerMiddleware } from "./app/middlewares/LoggerMiddleware.js";
import { MethodMiddleware } from "./app/middlewares/MethodMiddleware.js";
import { PoolTest } from "./app/tests/PoolTest.js";
import { LoginBuilder } from "./core/login/LoginBuilder.js";
import { RefreshBuilder } from "./core/refresh/RefreshBuilder.js";
import { SignupBuilder } from "./core/signup/SignupBuilder.js";

// App
const app: Express = express();

// Configurations
app.disable("x-powered-by");

// Pre-Middlewares
app.use(express.json());
app.use(LoggerMiddleware.log.bind(LoggerMiddleware));

// >--------------------------------------< ROUTES START >--------------------------------------< //

// AUTHENTICATING ROUTES
app.use(
  // /login
  LoginBuilder.BASE_ROUTE,
  new LoginBuilder().router,
);
app.use(
  // /signup
  SignupBuilder.BASE_ROUTE,
  new SignupBuilder().router,
);

// PRIVATE ROUTES
app.use(
  // /refresh
  RefreshBuilder.BASE_ROUTE,
  AuthMiddleware.verifyAuth().bind(AuthMiddleware),
  new RefreshBuilder().router,
);

// >---------------------------------------< ROUTES END >---------------------------------------< //

// Post-Middlewares
app.use("{*any}", MethodMiddleware.methodNotAllowed.bind(MethodMiddleware));
app.use("{*any}", CatcherMiddleware.resourceNotFound.bind(CatcherMiddleware));
app.use(FailureMiddleware.serverFailure.bind(FailureMiddleware));

// Tests
void PoolTest.run();

// Start app
app.listen(AppConfig.PORT, (): void => {
  LogHelper.progress(`Server listening on port ${AppConfig.PORT}...`);
});
