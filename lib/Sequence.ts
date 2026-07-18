import {
  asSequence,
  SEQUENCE_TYPE_NAME,
  type SequenceType,
  type Type,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export function getSequenceId(innerType: Type): string {
  return `${SEQUENCE_TYPE_NAME}<${typeRegistry.getId(innerType)}>`;
}

export function Sequence<T extends Type>(T: T): SequenceType<T> {
  const id = getSequenceId(T);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as SequenceType<T>;
  }

  const SequenceT: SequenceType<T> = Object.defineProperty(
    function Sequence(this: SequenceType<T> | void, value: unknown) {
      return asSequence.call(getContextType(this, SequenceT), value);
    },
    "T",
    {
      value: T,
      writable: false,
      enumerable: true,
      configurable: true,
    },
  ) as SequenceType<T>;

  return typeRegistry.define(id, SequenceT);
}
