import {
  asBoolean,
  BOOLEAN_TYPE_NAME,
  type BooleanType,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export const Boolean: BooleanType = typeRegistry.define(
  BOOLEAN_TYPE_NAME,
  function boolean(this: BooleanType | void, value: unknown): boolean {
    return asBoolean.call(getContextType(this, Boolean), value);
  } as BooleanType,
);
