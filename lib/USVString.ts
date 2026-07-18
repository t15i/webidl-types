import {
  asUSVString,
  USV_STRING_TYPE_NAME,
  type USVStringType,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

const DefaultUSVString: USVStringType = typeRegistry.define(
  USV_STRING_TYPE_NAME,
  function USVString(this: USVStringType | void, value: unknown): string {
    return asUSVString.call(getContextType(this, DefaultUSVString), value);
  } as USVStringType,
);

export { DefaultUSVString as USVString };
