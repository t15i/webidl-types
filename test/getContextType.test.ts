/**
 * Tests for context resolution shared by every Type.
 *
 * A Type reads its parameters off its `this`. When a Type is stored as a
 * method of some object, invoking it (`obj.field(value)`) passes that object
 * as `this` instead of the Type. `getContextType` guards against this by only
 * honouring a receiver that is a Type registered in the registry, otherwise
 * falling back to the Type itself.
 *
 * The first block exercises every exported Type through a method call and
 * asserts it still converts (in particular, that it does not fail early with
 * a TypeError from reading a parameter off the wrong `this`). The second
 * block unit-tests {@link getContextType} directly.
 */
import { describe, expect, test } from "vitest";

import { Clamp, type Type } from "@t15i/webspecs/webidl";
import {
  Annotated,
  BigInt,
  Boolean,
  DOMString,
  Double,
  FrozenArray,
  InterfaceType,
  Long,
  Nullable,
  Record,
  Sequence,
  Undefined,
  Union,
  UnsignedLong,
  USVString,
} from "lib";
import { getContextType } from "lib/getContextType";

class GetContextTypeInterfaceFoo {}

/**
 * One representative `[name, Type, value]` triple per exported Type. `value`
 * is a valid input the Type converts without throwing, so a successful call
 * proves the context was resolved rather than read off the owning object.
 */
const cases: ReadonlyArray<
  readonly [name: string, type: Type, value: unknown]
> = [
  ["Undefined", Undefined, undefined],
  ["Boolean", Boolean, true],
  ["Long", Long, 42],
  ["UnsignedLong", UnsignedLong, 42],
  ["Double", Double, 1.5],
  ["BigInt", BigInt, 42n],
  ["DOMString", DOMString, "x"],
  ["USVString", USVString, "x"],
  ["Nullable", Nullable(Long), null],
  ["Sequence", Sequence(Long), [1, 2, 3]],
  ["FrozenArray", FrozenArray(Long), [1, 2, 3]],
  ["Record", Record(DOMString, Long), { a: 1 }],
  ["Union", Union(Long, DOMString), 42],
  [
    "InterfaceType",
    InterfaceType(GetContextTypeInterfaceFoo),
    new GetContextTypeInterfaceFoo(),
  ],
  ["Annotated", Annotated({ [Clamp]: null }, Long), 42],
];

describe("Type as a method - context resolution", () => {
  test.each(cases)(
    "%s converts when invoked as a method of a plain object",
    (_name, type, value) => {
      // The owning object is not a Type and carries none of the Type's
      // parameters; a naive `this ?? default` fallback would use it and fail.
      const owner = { convert: type };
      expect(() => owner.convert(value)).not.toThrow();
    },
  );
});

describe("getContextType", () => {
  test("returns the receiver when it is a registered Type", () => {
    const ClampedLong = Annotated({ [Clamp]: null }, Long);
    expect(getContextType(ClampedLong, Long)).toBe(ClampedLong);
  });

  test("falls back to the default for different type names", () => {
    expect(getContextType(Boolean, Long)).toBe(Long);
  });

  test("falls back to the default for a plain object receiver", () => {
    expect(getContextType({}, Long)).toBe(Long);
  });

  test("falls back to the default for a nullish receiver", () => {
    expect(getContextType(undefined, Long)).toBe(Long);
    expect(getContextType(null, Long)).toBe(Long);
  });

  test("falls back to the default for an unregistered function receiver", () => {
    expect(getContextType(() => undefined, Long)).toBe(Long);
  });
});
