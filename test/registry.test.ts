/**
 * Tests for the TypeRegistry contract: deduplication when the same
 * id is defined twice, and round-tripping between id and Type via
 * get / getId.
 *
 * Anything that depends on a specific factory's id-composition rules
 * (e.g. "Nullable<long>") belongs in that factory's own test file.
 */
import { describe, expect, test } from "vitest";

import { Boolean, Long } from "lib";
import { TypeRegistry } from "lib/registry";

describe("TypeRegistry - deduplication on shared id", () => {
  test("define returns the first Type registered for a given id", () => {
    const r = new TypeRegistry();
    expect(r.define("id", Boolean)).toBe(Boolean);
    expect(r.define("id", Long)).toBe(Boolean);
  });

  test("define keeps the first Type addressable by id after a redefinition attempt", () => {
    const r = new TypeRegistry();
    r.define("id", Boolean);
    r.define("id", Long);
    expect(r.get("id")).toBe(Boolean);
  });
});

describe("TypeRegistry - defined", () => {
  test("returns true for an id that has been defined", () => {
    const r = new TypeRegistry();
    r.define("id", Boolean);
    expect(r.defined("id")).toBe(true);
  });

  test("returns false for an id that has never been defined", () => {
    const r = new TypeRegistry();
    expect(r.defined("missing")).toBe(false);
  });
});

describe("TypeRegistry - id and Type round-trip", () => {
  test("get returns the Type registered for an id", () => {
    const r = new TypeRegistry();
    r.define("id", Boolean);
    expect(r.get("id")).toBe(Boolean);
  });

  test("getId returns the id registered for a Type", () => {
    const r = new TypeRegistry();
    r.define("id", Boolean);
    expect(r.getId(Boolean)).toBe("id");
  });

  test("get returns undefined for an unknown id", () => {
    const r = new TypeRegistry();
    expect(r.get("missing")).toBe(undefined);
  });

  test("getId returns undefined for an unregistered Type", () => {
    const r = new TypeRegistry();
    expect(r.getId(Boolean)).toBe(undefined);
  });
});
