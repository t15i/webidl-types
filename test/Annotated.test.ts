/**
 * Tests for what Annotated specifically adds:
 *
 * - "creation": that the factory wires `innerType` and a snapshot
 *   copy of `extendedAttributes` onto the produced Type, and that
 *   the produced Type reuses the inner Type's `name` (rather than
 *   being renamed to "Annotated").
 * - "id": that the registry id renders each extended attribute as
 *   `Name` (valueless) or `Name=value`, and orders them
 *   lexicographically so that authoring order does not matter.
 * - "caching": that the registry id folds in the attribute keys and
 *   their values, so Types with different attribute sets are cached
 *   separately while a reordered but equal set is not.
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

import {
  AllowResizable,
  AllowShared,
  Clamp,
  EnforceRange,
} from "@t15i/webspecs/webidl";
import { Annotated, DOMString, Long, UnsignedLong } from "lib";
import { getAnnotatedId } from "lib/Annotated";

/**
 * Every extended attribute shipped by \@t15i/webspecs is currently
 * valueless, so a test-only one stands in for the takes-an-argument
 * form (e.g. `[MaxLength=4]`).
 */
const MaxLength = "maxLength";
declare module "@t15i/webspecs/webidl" {
  interface TypeExtendedAttributes {
    [MaxLength]?: number;
  }
}

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

describe("Annotated - id", () => {
  test("renders a valueless attribute as its bare name", () => {
    expect(getAnnotatedId({ [Clamp]: null }, Long)).toBe("[Clamp] long");
  });

  test("renders an attribute that has a value as 'Name=value'", () => {
    expect(getAnnotatedId({ [MaxLength]: 4 }, Long)).toBe("[MaxLength=4] long");
  });

  test("orders attributes lexicographically, not in authoring order", () => {
    expect(
      getAnnotatedId({ [AllowShared]: null, [AllowResizable]: null }, Long),
    ).toBe("[AllowResizable AllowShared] long");
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

  test("returns a different Type when the same attribute carries a different value", () => {
    expect(Annotated({ [MaxLength]: 4 }, DOMString)).not.toBe(
      Annotated({ [MaxLength]: 8 }, DOMString),
    );
  });

  test("returns the cached Type when an equal attribute set is written in a different order", () => {
    expect(
      Annotated({ [AllowShared]: null, [AllowResizable]: null }, DOMString),
    ).toBe(
      Annotated({ [AllowResizable]: null, [AllowShared]: null }, DOMString),
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
