import {
  validateAnnotatedInnerType,
  type AnnotatedType,
  type Type,
  type TypeExtendedAttributes,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

function getExtendedAttributeName(key: string): string {
  return key.replace(/^./u, (first) => first.toUpperCase());
}

export function getAnnotatedId(
  extendedAttributes: TypeExtendedAttributes,
  innerType: Type,
): string {
  const xattrs = Object.keys(extendedAttributes)
    .map((key) => {
      const name = getExtendedAttributeName(key);
      const value = (extendedAttributes as Record<string, unknown>)[key];
      return value === null ? name : `${name}=${value}`;
    })
    .sort();
  return `[${xattrs.join(" ")}] ${typeRegistry.getId(innerType)}`;
}

export function Annotated<T extends Type>(
  extendedAttributes: TypeExtendedAttributes,
  innerType: T,
): AnnotatedType<T> {
  const id = getAnnotatedId(extendedAttributes, innerType);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as AnnotatedType<T>;
  }

  const AnnotatedT: AnnotatedType<T> = Object.defineProperties(
    function Annotated(this: AnnotatedType<T> | void, value: unknown) {
      return innerType.call(getContextType(this, AnnotatedT), value);
    },
    {
      extendedAttributes: {
        value: { ...extendedAttributes },
        writable: false,
        enumerable: true,
        configurable: true,
      },
      innerType: {
        value: innerType,
        writable: false,
        enumerable: true,
        configurable: true,
      },
    },
  ) as AnnotatedType<T>;

  try {
    validateAnnotatedInnerType(innerType);
    return typeRegistry.define(id, AnnotatedT, innerType.name);
  } catch (e) {
    throw TypeError(`Failed to create type ${id}`, { cause: e });
  }
}
