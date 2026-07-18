/**
 * Tests for what Record specifically adds:
 *
 * - "creation": that the factory wires `K` and `V` onto the
 *   produced Type.
 * - "validation wiring": that a `validateRecordKeyType` failure is
 *   re-thrown as a TypeError prefixed with the would-be type id,
 *   with the original error preserved as `cause`. The rules of
 *   validateRecordKeyType themselves are covered in \@t15i/webspecs.
 * - "conversion (smoke)": a single call to verify the produced Type
 *   is callable and delegates to asRecord. Full WebIDL conversion
 *   rules are covered in \@t15i/webspecs.
 */
import type { RecordKeyType } from "@t15i/webspecs/webidl";
import { describe, expect, test } from "vitest";
import { DOMString, Long, Record } from "lib";

describe("Record - creation", () => {
  test("exposes K and V on the produced Type", () => {
    const T = Record(DOMString, Long);
    expect(T.K).toBe(DOMString);
    expect(T.V).toBe(Long);
  });
});

describe("Record - conversion (smoke)", () => {
  test("delegates to asRecord for a plain object input", () => {
    expect(Record(DOMString, Long)({ a: 1 })).toEqual({ a: 1 });
  });
});

describe("Record - caching", () => {
  test("returns the cached Type when called again with the same K and V", () => {
    expect(Record(DOMString, Long)).toBe(Record(DOMString, Long));
  });
});

describe("Record - validation wiring", () => {
  test("rethrows validateRecordKeyType failure with id-prefixed TypeError and original cause", () => {
    expect(() => Record(Long as unknown as RecordKeyType, Long)).toThrow(
      TypeError("Failed to create type Record<long, long>", {
        cause: expect.any(TypeError),
      }),
    );
  });
});
