import {
  asBigInt,
  BIGINT_TYPE_NAME,
  type BigIntType,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

export const BigInt: BigIntType = typeRegistry.define(
  BIGINT_TYPE_NAME,
  function bigint(this: BigIntType | void, value: unknown): bigint {
    return asBigInt.call(this ?? BigInt, value);
  } as BigIntType,
);
