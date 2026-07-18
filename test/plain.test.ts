/**
 * Conversion smoke tests for the plain (non-generic) types. Each
 * test calls the produced Type once with a representative input
 * just to verify that the facade is callable and delegates to the
 * corresponding asX from \@t15i/webspecs.
 *
 * Full WebIDL conversion rules are covered in \@t15i/webspecs.
 */
import { describe, expect, test } from "vitest";
import {
  BigInt,
  Boolean,
  DOMString,
  Double,
  Long,
  Undefined,
  UnsignedLong,
  USVString,
} from "lib";

describe("plain types - conversion (smoke)", () => {
  test("Undefined delegates to asUndefined", () => {
    expect(Undefined(undefined)).toBe(undefined);
  });

  test("Boolean delegates to asBoolean", () => {
    expect(Boolean(true)).toBe(true);
  });

  test("Long delegates to asLong", () => {
    expect(Long(42)).toBe(42);
  });

  test("UnsignedLong delegates to asUnsignedLong", () => {
    expect(UnsignedLong(42)).toBe(42);
  });

  test("Double delegates to asDouble", () => {
    expect(Double(1.5)).toBe(1.5);
  });

  test("BigInt delegates to asBigInt", () => {
    expect(BigInt(42n)).toBe(42n);
  });

  test("DOMString delegates to asDOMString", () => {
    expect(DOMString("hello")).toBe("hello");
  });

  test("USVString delegates to asUSVString", () => {
    expect(USVString("hello")).toBe("hello");
  });
});
