/**
 * BSD 3-Clause License
 *
 * Copyright (c) 2022, Daniel Jonathan <daniel at cosmicverse dot org>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import test from 'ava'

import {
  guardFor,
  Nullable,
  Optional,
  Voidable,
  Writable,
  Immutable,
  WithOptional,
  WithRequired,
  ValueKeysFor,
  RequiredKeysFor,
  NullableKeysFor,
  OptionalKeysFor,
  WritableKeysFor,
  ReadonlyKeysFor,
  PublicOnly,
  WritableOnly,
  ReadonlyOnly,
  RequiredOnly,
  NullableOnly,
  OptionalOnly,
} from '../src'

type A = {
  name: string
  age: number
  version: number
}

interface B {
  name: string
  age?: number
  readonly version: number
  location: string | null
}

class C {
  private _name: string
  private _age: number

  get name(): string {
    return this._name
  }

  get age(): number {
    return this._age
  }

  constructor(_name: string,  _age: number) {
    this._name = _name
    this._age = _age
  }
}

test('Type Defs: Nullable', t => {
  let a: Nullable<number> = 1

  t.is(a, 1)

  a = null
  t.is(null, a)
})

test('Type Defs: Optional', t => {
  let a: Optional<number> = 1

  t.is(a, 1)

  a = void 0
  t.is(void 0, a)
})

test('Type Defs: Voidable', t => {
  const a = (): Voidable<number> => {
    return 1
  }

  const b = (): ReturnType<typeof a> => {
    return 1
  }

  t.is(typeof a, typeof b)
})

test('Type Defs: Writable', t => {
  const a: Readonly<A> = {
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const b: Writable<typeof a, 'name' | 'age'> = {
    name: 'jonathan',
    age: 2,
    version: 1,
  }

  t.notDeepEqual(a, b)

  b.name = 'daniel'
  b.age = 1

  t.deepEqual(a, b)
})

test('Type Defs: Immutable', t => {
  const a: A = {
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const b: Immutable<typeof a, 'age'> = {
    name: 'jonathan',
    age: 1,
    version: 2,
  }

  t.notDeepEqual(a, b)

  b.name = 'daniel'
  b.version = 1

  t.deepEqual(a, b)
})

test('Type Defs: WithOptional', t => {
  const a: Required<A> = {
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const b: WithOptional<typeof a, 'age'> = {
    name: 'daniel',
    version: 2,
  }

  t.notDeepEqual(a, b)

  a.version = 1

  b.name = 'daniel'
  b.age = 1
  b.version = 1

  t.deepEqual(a, b)
})

test('Type Defs: WithRequired', t => {
  const a: Partial<A> = {
    name: 'daniel',
    age: 1,
  }

  const b: WithRequired<typeof a, 'age'> = {
    age: 1,
  }

  t.notDeepEqual(a, b)

  a.version = 1

  b.name = 'daniel'
  b.version = 1

  t.deepEqual(a, b)
})

test('Type Defs: ValueKeysFor', t => {
  const a: A & {
    test?: string
  } = {
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const fn = (key: ValueKeysFor<typeof a>): boolean =>
    'undefined' !== typeof key

  t.true(fn('name'))
  t.true(fn('age'))
  t.true(fn('version'))
  t.true(fn('test'))
})

test('Type Defs: RequiredKeysFor', t => {
  const a: A & {
    test?: string
  } = {
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const fn = (key: RequiredKeysFor<typeof a>): boolean =>
    'undefined' !== typeof key

  t.true(fn('name'))
  t.true(fn('age'))
  t.true(fn('version'))
  // t.true(fn('test'))
})

test('Type Defs: NullableKeysFor', t => {
  const a: A & {
    test: string | null
  } = {
    test: null,
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const fn = (key: NullableKeysFor<typeof a>): boolean =>
    'undefined' !== typeof key

  // t.true(fn('name'))
  // t.true(fn('age'))
  // t.true(fn('version'))
  t.true(fn('test'))
})

test('Type Defs: OptionalKeysFor', t => {
  const a: A & {
    test?: string
  } = {
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const fn = (key: OptionalKeysFor<typeof a>): boolean =>
    'undefined' !== typeof key

  // t.true(fn('name'))
  // t.true(fn('age'))
  // t.true(fn('version'))
  t.true(fn('test'))
})

test('Type Defs: WritableKeysFor', t => {
  const a: A & {
    readonly test: string
  } = {
    test: 'hello',
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const fn = (key: WritableKeysFor<typeof a>): boolean =>
    'undefined' !== typeof key

  t.true(fn('name'))
  t.true(fn('age'))
  t.true(fn('version'))
  // t.true(fn('test'))
})

test('Type Defs: ReadonlyKeysFor', t => {
  const a: A & {
    readonly test: string
  } = {
    test: 'hello',
    name: 'daniel',
    age: 1,
    version: 1,
  }

  const fn = (key: ReadonlyKeysFor<typeof a>): boolean =>
    'undefined' !== typeof key

  // t.true(fn('name'))
  // t.true(fn('age'))
  // t.true(fn('version'))
  t.true(fn('test'))
})

test('Type Defs: PublicOnly', t => {
  const c = new C('daniel', 1)
  const b: PublicOnly<C> = {
    name: 'daniel',
    age: 1,
  }

  t.is(c.name, b.name)
  t.is(c.age, b.age)
})

test('Type Defs: WritableOnly', t => {
  const b: WritableOnly<B> = {
    name: 'daniel',
    age: 1,
    location: null,
  }

  t.true(guardFor(b, ...Object.keys(b) as (keyof typeof b)[]))
})

test('Type Defs: ReadonlyOnly', t => {
  const b: ReadonlyOnly<B> = {
    version: 1,
  }

  t.true(guardFor(b, ...Object.keys(b) as (keyof typeof b)[]))
})

test('Type Defs: RequiredOnly', t => {
  const b: RequiredOnly<B> = {
    name: 'daniel',
    version: 1,
    location: null,
  }

  t.true(guardFor(b, ...Object.keys(b) as (keyof typeof b)[]))
})

test('Type Defs: NullableOnly', t => {
  const b: NullableOnly<B> = {
    location: null,
  }

  t.true(guardFor(b, ...Object.keys(b) as (keyof typeof b)[]))
})

test('Type Defs: OptionalOnly', t => {
  const b: OptionalOnly<B> = {
    age: 1,
  }

  t.true(guardFor(b, ...Object.keys(b) as (keyof typeof b)[]))
})
