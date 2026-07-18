import {
  asBoolean,
  BOOLEAN_TYPE_NAME,
  type BooleanType,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

export const Boolean: BooleanType = typeRegistry.define(
  BOOLEAN_TYPE_NAME,
  function boolean(this: BooleanType | void, value: unknown): boolean {
    return asBoolean.call(this ?? Boolean, value);
  } as BooleanType,
);
