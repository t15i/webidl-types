import {
  asUndefined,
  UNDEFINED_TYPE_NAME,
  type UndefinedType,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

export const Undefined: UndefinedType = typeRegistry.define(
  UNDEFINED_TYPE_NAME,
  // eslint-disable-next-line no-shadow-restricted-names
  function undefined(this: UndefinedType | void, value: unknown): undefined {
    return asUndefined.call(this ?? Undefined, value);
  } as UndefinedType,
);
