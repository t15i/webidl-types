import {
  asRecord,
  RECORD_TYPE_NAME,
  validateRecordKeyType,
  type RecordKeyType,
  type RecordType,
  type Type,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export function getRecordId(K: Type<string>, V: Type): string {
  return `${RECORD_TYPE_NAME}<${typeRegistry.getId(K)}, ${typeRegistry.getId(V)}>`;
}

export function Record<K extends RecordKeyType, V extends Type>(
  K: K,
  V: V,
): RecordType<K, V> {
  const id = getRecordId(K, V);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as RecordType<K, V>;
  }

  const RecordKV: RecordType<K, V> = Object.defineProperties(
    function Record(this: RecordType<K, V> | void, value: unknown) {
      return asRecord.call(getContextType(this, RecordKV), value);
    },
    {
      K: {
        value: K,
        writable: false,
        enumerable: true,
        configurable: true,
      },
      V: {
        value: V,
        writable: false,
        enumerable: true,
        configurable: true,
      },
    },
  ) as RecordType<K, V>;

  try {
    validateRecordKeyType(K);
    return typeRegistry.define(id, RecordKV);
  } catch (e) {
    throw TypeError(`Failed to create type ${id}`, { cause: e });
  }
}
