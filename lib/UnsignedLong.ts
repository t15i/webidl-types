import {
  asUnsignedLong,
  UNSIGNED_LONG_TYPE_NAME,
  type UnsignedLongType,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export const UnsignedLong: UnsignedLongType = typeRegistry.define(
  UNSIGNED_LONG_TYPE_NAME,
  Object.defineProperty(
    function (this: UnsignedLongType | void, value: unknown): number {
      return asUnsignedLong.call(getContextType(this, UnsignedLong), value);
    },
    "name",
    {
      value: UNSIGNED_LONG_TYPE_NAME,
      writable: false,
      enumerable: false,
      configurable: true,
    },
  ) as UnsignedLongType,
);
