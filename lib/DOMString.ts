import {
  asDOMString,
  DOM_STRING_TYPE_NAME,
  type DOMStringType,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

const DefaultDOMString: DOMStringType = typeRegistry.define(
  DOM_STRING_TYPE_NAME,
  function DOMString(this: DOMStringType | void, value: unknown): string {
    return asDOMString.call(this ?? DefaultDOMString, value);
  } as DOMStringType,
);

export { DefaultDOMString as DOMString };
