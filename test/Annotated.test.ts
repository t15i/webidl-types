/**
 * Tests for what Annotated specifically adds:
 *
 * - "creation": that the factory wires `innerType` and a snapshot
 *   copy of `extendedAttributes` onto the produced Type, and that
 *   the produced Type reuses the inner Type's `name` (rather than
 *   being renamed to "Annotated").
 * - "caching": that the registry id folds in the attribute keys, so
 *   Types with different attribute sets are cached separately.
 * - "validation wiring": that a `validateAnnotatedInnerType` failure
 *   is re-thrown as a TypeError prefixed with the would-be type id,
 *   with the original error preserved as `cause`. The rules of
 *   validateAnnotatedInnerType themselves are covered in
 *   \@t15i/webspecs.
 * - "conversion (smoke)": a single call to verify the produced Type
 *   is callable and delegates to the inner Type. Full WebIDL
 *   conversion rules are covered in \@t15i/webspecs.
 */
import { describe, expect, test } from "vitest";

import { Clamp, EnforceRange } from "@t15i/webspecs/webidl";
import { Annotated, DOMString, Long, UnsignedLong } from "lib";

describe("Annotated - creation", () => {
  test("exposes the inner Type on the produced Type", () => {
    const T = Annotated({ [Clamp]: null }, Long);
    expect(T.innerType).toBe(Long);
  });

  test("exposes the extended attributes on the produced Type", () => {
    const T = Annotated({ [Clamp]: null }, UnsignedLong);
    expect(T.extendedAttributes).toEqual({ [Clamp]: null });
  });

  test("stores a snapshot of extendedAttributes, not the caller's object", () => {
    const attrs = { [Clamp]: null };
    const T = Annotated(attrs, DOMString);
    expect(T.extendedAttributes).not.toBe(attrs);
  });

  test("preserves the inner Type's name (does not rename to 'Annotated')", () => {
    const T = Annotated({ [Clamp]: null }, Long);
    expect(T.name).toBe(Long.name);
  });
});

describe("Annotated - conversion (smoke)", () => {
  test("delegates to the inner Type", () => {
    expect(Annotated({ [Clamp]: null }, Long)(42)).toBe(42);
  });
});

describe("Annotated - caching", () => {
  test("returns the cached Type when called again with the same attributes and inner Type", () => {
    expect(Annotated({ [Clamp]: null }, Long)).toBe(
      Annotated({ [Clamp]: null }, Long),
    );
  });

  test("returns a different Type when the attribute keys differ", () => {
    expect(Annotated({ [Clamp]: null }, UnsignedLong)).not.toBe(
      Annotated({ [EnforceRange]: null }, UnsignedLong),
    );
  });
});

describe("Annotated - validation wiring", () => {
  test("rethrows validateAnnotatedInnerType failure with id-prefixed TypeError and original cause", () => {
    expect(() =>
      Annotated(
        { [Clamp]: null },
        Annotated({ [EnforceRange]: null }, UnsignedLong),
      ),
    ).toThrow(
      TypeError("Failed to create type [Clamp] [EnforceRange] unsigned long", {
        cause: expect.any(TypeError),
      }),
    );
  });
});
