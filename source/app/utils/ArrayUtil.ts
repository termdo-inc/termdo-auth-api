import type { IUtil } from "../interfaces/IUtil.js";

export class ArrayUtil implements IUtil {
  public static hasDuplicates(array: unknown[]): boolean {
    const set = new Set(array);
    if (set.size !== array.length) {
      return true;
    }
    return false;
  }
}
