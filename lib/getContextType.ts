import type { Type } from "@t15i/webspecs/webidl";
import { typeRegistry } from "./registry";

/**
 * Resolves the context Type for a Type call.
 *
 * A Type reads its parameters (e.g. `T`, `innerType`, `memberTypes`) off its
 * `this`. When a Type is invoked as a plain function its `this` is `undefined`
 * and the Type itself is the context. When it is invoked with an explicit Type
 * as `this` — e.g. `SomeType.call(otherType, value)` — that receiver is
 * honoured, which is what makes contexts swappable for extensibility.
 *
 * A Type stored as a method, however, receives the owning object as `this`:
 *
 * ```ts
 * const operation = { returnType: FrozenArray(InterfaceType(Element)) };
 * operation.returnType([x, y, z]); // `this` is `operation`, not the Type
 * ```
 *
 * `operation` is not a Type and does not carry the Type's parameters, so a bare
 * `this ?? defaultType` fallback would use it and fail. A receiver only counts
 * as a context when it is a Type registered in the {@link typeRegistry} — which
 * every Type this package produces is. A plain object, `undefined` or `null`
 * are not registered, so they fall back to `defaultType`.
 *
 * @param receiver - The `this` a Type was called with.
 * @param defaultType - The Type to use when `receiver` is not itself a Type.
 * @returns `receiver` when it is a registered Type, otherwise `defaultType`.
 */
export function getContextType<T extends Type>(
  receiver: unknown,
  defaultType: T,
): T {
  return typeRegistry.getId(receiver as Type) !== undefined
    ? (receiver as T)
    : defaultType;
}
