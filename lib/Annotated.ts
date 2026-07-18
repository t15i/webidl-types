import {
  validateAnnotatedInnerType,
  type AnnotatedType,
  type Type,
  type TypeExtendedAttributes,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export function getAnnotatedId(
  extendedAttributes: TypeExtendedAttributes,
  innerType: Type,
): string {
  const parts = Object.getOwnPropertySymbols(extendedAttributes).map(
    (s) => s.description!,
  );
  return `[${parts.join(", ")}] ${typeRegistry.getId(innerType)}`;
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
      name: {
        value: innerType.name,
        writable: false,
        enumerable: false,
        configurable: true,
      },
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
    return typeRegistry.define(id, AnnotatedT);
  } catch (e) {
    throw TypeError(`Failed to create type ${id}`, { cause: e });
  }
}
