import {
  asDOMString,
  DOM_STRING_TYPE_NAME,
  type DOMStringType,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

const DefaultDOMString: DOMStringType = typeRegistry.define(
  DOM_STRING_TYPE_NAME,
  function DOMString(this: DOMStringType | void, value: unknown): string {
    return asDOMString.call(getContextType(this, DefaultDOMString), value);
  } as DOMStringType,
);

export { DefaultDOMString as DOMString };
