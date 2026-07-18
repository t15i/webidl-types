/**
 * Tests for what Nullable specifically adds:
 *
 * - "creation": that the factory wires `innerType` onto the
 *   produced Type.
 * - "validation wiring": that a `validateNullableInnerType` failure
 *   is re-thrown as a TypeError prefixed with the would-be type id,
 *   with the original error preserved as `cause`. The rules of
 *   validateNullableInnerType themselves are covered in
 *   \@t15i/webspecs.
 * - "conversion (smoke)": a single call to verify the produced Type
 *   is callable and delegates to asNullable. Full WebIDL conversion
 *   rules are covered in \@t15i/webspecs.
 */
import { describe, expect, test } from "vitest";
import { Long, Nullable } from "lib";

describe("Nullable - creation", () => {
  test("exposes the inner Type on the produced Type", () => {
    const T = Nullable(Long);
    expect(T.innerType).toBe(Long);
  });
});

describe("Nullable - conversion (smoke)", () => {
  test("delegates to asNullable for a null input", () => {
    expect(Nullable(Long)(null)).toBe(null);
  });
});

describe("Nullable - caching", () => {
  test("returns the cached Type when called again with the same inner Type", () => {
    expect(Nullable(Long)).toBe(Nullable(Long));
  });
});

describe("Nullable - validation wiring", () => {
  test("rethrows validateNullableInnerType failure with id-prefixed TypeError and original cause", () => {
    expect(() => Nullable(Nullable(Long))).toThrow(
      TypeError("Failed to create type Nullable<Nullable<long>>", {
        cause: expect.any(TypeError),
      }),
    );
  });
});
