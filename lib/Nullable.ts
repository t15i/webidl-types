import {
  asNullable,
  NULLABLE_TYPE_NAME,
  validateNullableInnerType,
  type NullableType,
  type Type,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

export function getNullableId(innerType: Type): string {
  return `${NULLABLE_TYPE_NAME}<${typeRegistry.getId(innerType)}>`;
}

export function Nullable<T extends Type>(innerType: T): NullableType<T> {
  const id = getNullableId(innerType);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as NullableType<T>;
  }

  const NullableT: NullableType<T> = Object.defineProperty(
    function Nullable(this: NullableType<T> | void, value: unknown) {
      return asNullable.call(this ?? NullableT, value);
    },
    "innerType",
    {
      value: innerType,
      writable: false,
      enumerable: true,
      configurable: true,
    },
  ) as NullableType<T>;

  try {
    validateNullableInnerType(innerType);
    return typeRegistry.define(id, NullableT);
  } catch (e) {
    throw TypeError(`Failed to create type ${id}`, { cause: e });
  }
}
