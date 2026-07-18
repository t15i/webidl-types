import {
  asDouble,
  DOUBLE_TYPE_NAME,
  type DoubleType,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export const Double: DoubleType = typeRegistry.define(
  DOUBLE_TYPE_NAME,
  function double(this: DoubleType | void, value: unknown): number {
    return asDouble.call(getContextType(this, Double), value);
  } as DoubleType,
);
