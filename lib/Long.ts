import { asLong, LONG_TYPE_NAME, type LongType } from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export const Long: LongType = typeRegistry.define(LONG_TYPE_NAME, function long(
  this: LongType | void,
  value: unknown,
): number {
  return asLong.call(getContextType(this, Long), value);
} as LongType);
