/**
 * Tests for what InterfaceType specifically adds:
 *
 * - "creation": that the factory wires the constructor as `T` onto
 *   the produced Type.
 * - "conversion (smoke)": a single call to verify the produced Type
 *   is callable and delegates to asInterfaceType. Full WebIDL
 *   conversion rules are covered in \@t15i/webspecs.
 *
 * Each test uses a uniquely-named local class so that the
 * registry's id-based deduplication does not return a cached
 * Type built around a different class with the same name.
 */
import { describe, expect, test } from "vitest";
import { InterfaceType } from "lib";

describe("InterfaceType - creation", () => {
  test("exposes the constructor as T on the produced Type", () => {
    class InterfaceCreationFoo {}
    const I = InterfaceType(InterfaceCreationFoo);
    expect(I.T).toBe(InterfaceCreationFoo);
  });
});

describe("InterfaceType - conversion (smoke)", () => {
  test("delegates to asInterfaceType for an instance input", () => {
    class InterfaceConversionFoo {}
    const instance = new InterfaceConversionFoo();
    expect(InterfaceType(InterfaceConversionFoo)(instance)).toBe(instance);
  });
});

describe("InterfaceType - caching", () => {
  test("returns the cached Type when called again with the same constructor", () => {
    class InterfaceCachingFoo {}
    expect(InterfaceType(InterfaceCachingFoo)).toBe(
      InterfaceType(InterfaceCachingFoo),
    );
  });
});
