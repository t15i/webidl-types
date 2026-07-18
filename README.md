# webidl-types - TypeScript implementations of WebIDL types

Callable, interned type objects for the
[WebIDL](https://webidl.spec.whatwg.org/) type system. Each type is a function
you call with a JavaScript value to get back the value converted according to
its WebIDL rules. The conversion algorithms themselves — `long` wrapping,
`unsigned long` clamping, `DOMString` stringification, and so on — are provided
by [`@t15i/webspecs`](https://github.com/t15i/webspecs); this package wraps them
into composable, introspectable `Type` objects.

> **Coverage is intentionally narrow** — this is a knowledge base, not a
> polyfill. Only the types that have been ported so far are listed below;
> everything else is marked with `...`.

## Install

```sh
npm install @t15i/webidl-types
```

`@t15i/webspecs` is a peer dependency and must be installed alongside it:

```sh
npm install @t15i/webspecs
```

## Usage

Every type is exposed from a single entry point:

```ts
import {
  Long,
  DOMString,
  Nullable,
  Sequence,
  Union,
  Annotated,
  EnforceRange,
  // ...
} from "@t15i/webidl-types";
```

### Types are converters

Call a type with a value to convert it per its WebIDL rules:

```ts
Long(42); // 42
Long("42"); // 42        (ToNumber, then integer conversion)
Long(4294967297); // 1   (wraps modulo 2^32)
Long(3.9); // 3          (truncates toward zero)

UnsignedLong(-1); // 4294967295
DOMString(123); // "123"
Boolean(0); // false
```

### Types compose

The generic factories build compound types from other types. The result is
itself a callable type:

```ts
const Ids = Sequence(Long);
Ids([1, 2, 3]); // [1, 2, 3]

const Name = Nullable(DOMString);
Name(null); // null

const Tags = FrozenArray(DOMString);
Object.isFrozen(Tags(["a", "b"])); // true

const Headers = Record(DOMString, DOMString);
const Id = Union(Long, DOMString);
```

### Annotated types carry extended attributes

Wrap a type with WebIDL extended attributes to change how it converts. The
attribute markers are re-exported from `@t15i/webspecs`:

```ts
import { Annotated, Long, Clamp, EnforceRange } from "@t15i/webidl-types";

Annotated({ [Clamp]: null }, Long)(4294967297); // 2147483647 (clamped)
Annotated({ [EnforceRange]: null }, Long)(4294967297); // throws TypeError
```

### Types are interned

Structurally equal types are the same object, so you can compare them by
identity. Building a type is memoized through the shared `typeRegistry`:

```ts
Nullable(Long) === Nullable(Long); // true
Union(Long, DOMString) === Union(Long, DOMString); // true
```

Each type also exposes its structural metadata — for example `innerType` on a
`Nullable`, `memberTypes` on a `Union`, and `K` / `V` on a `Record` — which the
registry uses to derive a stable id for interning.

## What's implemented

A checklist of every [WebIDL type](https://webidl.spec.whatwg.org/#idl-types).
Checked items are implemented and exported by this package.

- [ ] `any`
- [x] `undefined` → `Undefined`
- [x] `boolean` → `Boolean`
- [ ] `byte`
- [ ] `octet`
- [ ] `short`
- [ ] `unsigned short`
- [x] `long` → `Long`
- [x] `unsigned long` → `UnsignedLong`
- [ ] `long long`
- [ ] `unsigned long long`
- [ ] `float`
- [ ] `unrestricted float`
- [x] `double` → `Double`
- [ ] `unrestricted double`
- [x] `bigint` → `BigInt`
- [x] `DOMString` → `DOMString`
- [ ] `ByteString`
- [x] `USVString` → `USVString`
- [ ] `object`
- [ ] `symbol`
- [x] interface types → `InterfaceType`
- [ ] callback interface types
- [ ] dictionary types
- [ ] enumeration types
- [ ] callback function types
- [x] nullable types → `Nullable`
- [x] sequence types → `Sequence`
- [ ] async iterable types
- [x] record types → `Record`
- [ ] promise types
- [x] union types → `Union`
- [x] annotated types → `Annotated`
- [ ] buffer source types
- [x] frozen array types → `FrozenArray`
- [ ] observable array types

## License

[MIT](./LICENSE)
