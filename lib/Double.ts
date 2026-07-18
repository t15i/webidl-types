import {
  asDouble,
  DOUBLE_TYPE_NAME,
  type DoubleType,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

export const Double: DoubleType = typeRegistry.define(
  DOUBLE_TYPE_NAME,
  function double(this: DoubleType | void, value: unknown): number {
    return asDouble.call(this ?? Double, value);
  } as DoubleType,
);
