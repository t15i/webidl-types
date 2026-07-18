import {
  asUnion,
  getFlattenedMemberTypes,
  getNumberOfNullableMemberTypes,
  includesNullableType,
  NULLABLE_TYPE_NAME,
  NUMERIC_TYPE_NAME,
  NUMERIC_TYPE_NAMES,
  STRING_TYPE_NAME,
  STRING_TYPE_NAMES,
  validateFlattenedMemberTypes,
  validateNumberOfNullableMemberTypes,
  validateUnionMemberTypes,
  type FlattenedMemberTypes,
  type Type,
  type TypeMap,
  type UnionType,
} from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

export function getUnionId(memberTypes: readonly Type[]): string {
  return `(${memberTypes.map((U) => typeRegistry.getId(U)).join(" or ")})`;
}

class FlattenedMemberTypesImpl
  extends Array<Type>
  implements FlattenedMemberTypes<Type>
{
  readonly #names: Set<string> = new Set();
  readonly #byName: Map<string, Type> = new Map();

  constructor(memberTypes: readonly Type[]) {
    super(...getFlattenedMemberTypes({ memberTypes } as UnionType));

    for (const T of this) {
      this.#names.add(T.name);
      this.#byName.set(T.name, T);

      if (NUMERIC_TYPE_NAMES.has(T.name)) {
        this.#names.add(NUMERIC_TYPE_NAME);
        this.#byName.set(NUMERIC_TYPE_NAME, T);
      }

      if (STRING_TYPE_NAMES.has(T.name)) {
        this.#names.add(STRING_TYPE_NAME);
        this.#byName.set(STRING_TYPE_NAME, T);
      }
    }

    const nullable = memberTypes.find((m) => includesNullableType(m));
    if (nullable !== undefined) {
      this.#names.add(NULLABLE_TYPE_NAME);
      this.#byName.set(NULLABLE_TYPE_NAME, nullable);
    }
  }

  has(name: string): boolean {
    return this.#names.has(name);
  }

  get<K extends keyof TypeMap>(name: K): TypeMap[K] {
    return this.#byName.get(name) as TypeMap[K];
  }
}

export function Union<Ts extends readonly Type[]>(
  ...memberTypes: Ts
): UnionType<Ts[number]> {
  const id = getUnionId(memberTypes);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as UnionType<Ts[number]>;
  }

  const UnionT = Object.defineProperties(
    function Union(this: UnionType<Ts[number]> | void, value: unknown) {
      return asUnion.call(this ?? UnionT, value);
    },
    {
      memberTypes: {
        value: memberTypes,
        writable: false,
        enumerable: true,
        configurable: true,
      },
      flattenedMemberTypes: {
        value: new FlattenedMemberTypesImpl(memberTypes),
        writable: false,
        enumerable: true,
        configurable: true,
      },
      numberOfNullableMemberTypes: {
        get: () => getNumberOfNullableMemberTypes(UnionT),
        enumerable: true,
        configurable: true,
      },
    },
  ) as UnionType<Ts[number]>;

  try {
    validateUnionMemberTypes(UnionT);
    validateFlattenedMemberTypes(UnionT);
    validateNumberOfNullableMemberTypes(UnionT);
    return typeRegistry.define(id, UnionT);
  } catch (e) {
    throw TypeError(`Failed to create type ${id}`, { cause: e });
  }
}
