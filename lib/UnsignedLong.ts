import {
  asUnsignedLong,
  UNSIGNED_LONG_TYPE_NAME,
  type UnsignedLongType,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export const UnsignedLong: UnsignedLongType = typeRegistry.define(
  UNSIGNED_LONG_TYPE_NAME,
  function (this: UnsignedLongType | void, value: unknown): number {
    return asUnsignedLong.call(getContextType(this, UnsignedLong), value);
  } as UnsignedLongType,
);
