import {
  asInterfaceType,
  type InterfaceType as InterfaceTypeSpec,
} from "@t15i/webspecs/webidl";
import { getContextType } from "./getContextType";
import { typeRegistry } from "./registry";

export function getInterfaceTypeId(
  Ctor: new (...args: never[]) => unknown,
): string {
  return Ctor.name;
}

export function InterfaceType<T>(
  Ctor: new (...args: never[]) => T,
): InterfaceTypeSpec<T> {
  const id = getInterfaceTypeId(Ctor);

  if (typeRegistry.defined(id)) {
    return typeRegistry.get(id)! as InterfaceTypeSpec<T>;
  }

  const InterfaceT: InterfaceTypeSpec<T> = Object.defineProperty(
    function InterfaceType(this: InterfaceTypeSpec<T> | void, value: unknown) {
      return asInterfaceType.call(getContextType(this, InterfaceT), value);
    },
    "T",
    {
      value: Ctor as unknown as new (...args: unknown[]) => T,
      writable: false,
      enumerable: true,
      configurable: true,
    },
  ) as InterfaceTypeSpec<T>;

  return typeRegistry.define(id, InterfaceT);
}
