import type { IRules } from "../../app/interfaces/IRules.js";

export class AccountRules implements IRules {
  public static readonly USERNAME_MIN_LENGTH = 2;
  public static readonly USERNAME_MAX_LENGTH = 32;
  public static readonly USERNAME_REGEX = /^[a-zA-Z0-9._]+$/u;

  public static readonly PASSWORD_MIN_LENGTH = 4;
  public static readonly PASSWORD_MAX_LENGTH = Number.MAX_SAFE_INTEGER;
  public static readonly PASSWORD_REGEX =
    /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\p{N})(?=.*[^\p{L}\p{N}\s])\S+$/u;
}
