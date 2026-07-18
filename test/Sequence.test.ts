/**
 * Tests for what Sequence specifically adds:
 *
 * - "creation": that the factory wires the inner Type as `T` onto
 *   the produced Type.
 * - "conversion (smoke)": a single call to verify the produced Type
 *   is callable and delegates to asSequence. Full WebIDL conversion
 *   rules are covered in \@t15i/webspecs.
 */
import { describe, expect, test } from "vitest";
import { Long, Sequence } from "lib";

describe("Sequence - creation", () => {
  test("exposes the inner Type as T on the produced Type", () => {
    const S = Sequence(Long);
    expect(S.T).toBe(Long);
  });
});

describe("Sequence - conversion (smoke)", () => {
  test("delegates to asSequence for an iterable input", () => {
    expect(Sequence(Long)([1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe("Sequence - caching", () => {
  test("returns the cached Type when called again with the same inner Type", () => {
    expect(Sequence(Long)).toBe(Sequence(Long));
  });
});
