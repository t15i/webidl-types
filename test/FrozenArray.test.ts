/**
 * Tests for what FrozenArray specifically adds:
 *
 * - "creation": that the factory wires the inner Type as `T` onto
 *   the produced Type.
 * - "conversion (smoke)": a single call to verify the produced Type
 *   is callable and delegates to asFrozenArray. Full WebIDL
 *   conversion rules are covered in \@t15i/webspecs.
 */
import { describe, expect, test } from "vitest";
import { FrozenArray, Long } from "lib";

describe("FrozenArray - creation", () => {
  test("exposes the inner Type as T on the produced Type", () => {
    const FA = FrozenArray(Long);
    expect(FA.T).toBe(Long);
  });
});

describe("FrozenArray - conversion (smoke)", () => {
  test("delegates to asFrozenArray for an iterable input", () => {
    const result = FrozenArray(Long)([1, 2, 3]);
    expect([...result]).toEqual([1, 2, 3]);
    expect(Object.isFrozen(result)).toBe(true);
  });
});

describe("FrozenArray - caching", () => {
  test("returns the cached Type when called again with the same inner Type", () => {
    expect(FrozenArray(Long)).toBe(FrozenArray(Long));
  });
});
