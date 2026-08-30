import type { Type } from "@t15i/webspecs/webidl";

export class TypeRegistry {
  readonly #byId = new Map<string, Type>();
  readonly #idByType = new Map<Type, string>();

  define<T extends Type>(id: string, T: T, name: string = id): T {
    const cached = this.#byId.get(id);
    if (cached) return cached as T;

    Object.defineProperty(T, "name", {
      value: name,
      writable: false,
      enumerable: false,
      configurable: true,
    });

    this.#byId.set(id, T);
    this.#idByType.set(T, id);
    return T;
  }

  defined(id: string): boolean {
    return this.#byId.has(id);
  }

  get(id: string): Type | undefined {
    return this.#byId.get(id);
  }

  getId(T: Type): string | undefined {
    return this.#idByType.get(T);
  }
}

export const typeRegistry: TypeRegistry = new TypeRegistry();
