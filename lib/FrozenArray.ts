import {
  asFrozenArray,
  FROZEN_ARRAY_TYPE_NAME,
  type FrozenArrayType,
  type Type,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export function getFrozenArrayId(innerType: Type): string {
  return `${FROZEN_ARRAY_TYPE_NAME}<${typeRegistry.getId(innerType)}>`;
}

export function FrozenArray<T extends Type>(T: T): FrozenArrayType<T> {
  const id = getFrozenArrayId(T);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as FrozenArrayType<T>;
  }

  const FrozenArrayT: FrozenArrayType<T> = Object.defineProperty(
    function FrozenArray(this: FrozenArrayType<T> | void, value: unknown) {
      return asFrozenArray.call(getContextType(this, FrozenArrayT), value);
    },
    "T",
    {
      value: T,
      writable: false,
      enumerable: true,
      configurable: true,
    },
  ) as FrozenArrayType<T>;

  return typeRegistry.define(id, FrozenArrayT);
}
