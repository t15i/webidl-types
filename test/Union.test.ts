/**
 * Tests for the structural metadata built by Union (memberTypes and
 * the FlattenedMemberTypesImpl exposed as flattenedMemberTypes) and
 * for the validation wiring that re-throws validateX failures as a
 * TypeError prefixed with the would-be type id.
 *
 * Conversion semantics (asUnion) and the rules of validateX are
 * covered in \@t15i/webspecs.
 */
import { describe, expect, test } from "vitest";
import {
  Boolean,
  DOMString,
  Double,
  Long,
  Nullable,
  Sequence,
  Undefined,
  Union,
  USVString,
} from "lib";

describe("Union - memberTypes wiring", () => {
  test("memberTypes is the constructor argument list", () => {
    const T = Union(Long, DOMString);
    expect([...T.memberTypes]).toEqual([Long, DOMString]);
  });

  test("name is 'Union'", () => {
    expect(Union(Long, DOMString).name).toBe("Union");
  });
});

describe("FlattenedMemberTypesImpl - has(name)", () => {
  test("returns true for each flattened member name", () => {
    const T = Union(Long, DOMString);
    expect(T.flattenedMemberTypes.has("long")).toBe(true);
    expect(T.flattenedMemberTypes.has("DOMString")).toBe(true);
  });

  test("returns false for an unrelated name", () => {
    const T = Union(Long, DOMString);
    expect(T.flattenedMemberTypes.has("boolean")).toBe(false);
  });

  test("returns true for the virtual 'numeric' alias when any numeric member is present", () => {
    expect(Union(Long, DOMString).flattenedMemberTypes.has("numeric")).toBe(
      true,
    );
    expect(Union(Double, DOMString).flattenedMemberTypes.has("numeric")).toBe(
      true,
    );
  });

  test("returns false for 'numeric' when there is no numeric member", () => {
    expect(Union(Boolean, DOMString).flattenedMemberTypes.has("numeric")).toBe(
      false,
    );
  });

  test("returns true for the virtual 'string' alias when any string member is present", () => {
    expect(Union(Long, DOMString).flattenedMemberTypes.has("string")).toBe(
      true,
    );
    expect(Union(Long, USVString).flattenedMemberTypes.has("string")).toBe(
      true,
    );
  });

  test("returns false for 'string' when there is no string member", () => {
    expect(Union(Long, Boolean).flattenedMemberTypes.has("string")).toBe(false);
  });

  test("returns true for the virtual 'Nullable' alias when any member includes a nullable", () => {
    const T = Union(Nullable(DOMString), Long);
    expect(T.flattenedMemberTypes.has("Nullable")).toBe(true);
  });

  test("returns false for 'Nullable' when no member is nullable", () => {
    expect(Union(Long, DOMString).flattenedMemberTypes.has("Nullable")).toBe(
      false,
    );
  });
});

describe("FlattenedMemberTypesImpl - get(name)", () => {
  test("returns the matching member type by its own name", () => {
    const T = Union(Long, DOMString);

    expect(T.flattenedMemberTypes.get("long")).toBe(Long);
    expect(T.flattenedMemberTypes.get("DOMString")).toBe(DOMString);
  });

  test("returns the numeric/string member for the virtual aliases", () => {
    const T = Union(Long, DOMString);
    expect(T.flattenedMemberTypes.get("numeric")).toBe(Long);
    expect(T.flattenedMemberTypes.get("string")).toBe(DOMString);
  });

  test("returns the original nullable member for the 'Nullable' alias", () => {
    const inner = Nullable(DOMString);
    const T = Union(inner, Long);
    expect(T.flattenedMemberTypes.get("Nullable")).toBe(inner);
  });
});

describe("FlattenedMemberTypesImpl - iteration", () => {
  test("yields the flattened member types", () => {
    const T = Union(Long, DOMString);
    expect([...T.flattenedMemberTypes]).toEqual([Long, DOMString]);
  });

  test("does not duplicate types when virtual aliases overlap with real names", () => {
    // Long contributes both "long" and "numeric"; iteration should still
    // yield Long once.
    const T = Union(Long, DOMString);
    expect([...T.flattenedMemberTypes]).toHaveLength(2);
  });

  test("unwraps Nullable wrappers in the flattened list", () => {
    const T = Union(Nullable(DOMString), Long);
    const names = [...T.flattenedMemberTypes].map((U) => U.name);
    expect(names).toContain("DOMString");
    expect(names).toContain("long");
    expect(names).not.toContain("Nullable");
  });

  test("flattens nested Union members", () => {
    const T = Union(Long, Union(DOMString, Undefined));
    expect([...T.flattenedMemberTypes]).toEqual([Long, DOMString, Undefined]);
  });

  test("unwraps and flattens Sequence inside Nullable (Sequence stays)", () => {
    // Nullable<Sequence<long>> -> inner Sequence<long>
    const T = Union(Nullable(Sequence(Long)), DOMString);
    const flat = [...T.flattenedMemberTypes];
    expect(flat.map((U) => U.name)).toEqual(["Sequence", "DOMString"]);
  });
});

describe("Union - caching", () => {
  test("returns the cached Type when called again with the same member Types", () => {
    expect(Union(Long, DOMString)).toBe(Union(Long, DOMString));
  });
});

describe("Union - validation wiring", () => {
  test("rethrows validateNumberOfNullableMemberTypes failure with id-prefixed TypeError and original cause", () => {
    expect(() => Union(Nullable(Long), Nullable(DOMString))).toThrow(
      TypeError(
        "Failed to create type (Nullable<long> or Nullable<DOMString>)",
        { cause: expect.any(TypeError) },
      ),
    );
  });
});

// Full WebIDL conversion rules are covered in @t15i/webspecs.
describe("Union - conversion (smoke)", () => {
  test("delegates to asUnion for an input distinguished by a member type", () => {
    expect(Union(Long, DOMString)(42)).toBe(42);
  });
});
