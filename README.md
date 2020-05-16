# unifire


[![Build Status](https://travis-ci.org/jpodwys/unifire.svg?branch=master)](https://travis-ci.org/jpodwys/unifire)
[![codecov](https://codecov.io/gh/jpodwys/unifire/branch/master/graph/badge.svg)](https://codecov.io/gh/jpodwys/unifire)
[![code coverage](https://codecov.io/gh/jpodwys/unifire/branch/master/graph/badge.svg)](https://codecov.io/gh/jpodwys/unifire)

# Docs are current a WIP

# Table of Contents
Features
Guide
Counter App
Todo App
Integrations
API

# Features

## Tiny
400 (brotli-compressed) bytes. No dependencies.

## Simple
Everything you need is right here in one package. Including the constructor, Unifire has four public methods and one public property.

## Flexibility
From single-store global state management all the way to a per-model multi-store setup, Unifire's got you covered.

## TypeScript support
The types are strong with this one. (This is my first go at making a `d.ts` file, so contributions are appreciated.)

## Efficient
Unifire only calls a subscriber when one of its dependencies changes.

## Derived state
Also referred to as "computed properties," Unifire allows you to subscribe directly to store-level derivations. Check out how simple Unifire's computed properties are:

```js
const state = {
  count: 1,
  doubled: ({ count }) => count * 2
}
```

Done! No we have `doubled`, a computed property, to which we can subscribe. Any time `count` changes, Unifire will call all of `doubled`'s subscribers.

And, since you're wondering, yes you can have computed properties that depend on computed properties like-a-so:

```js
const state = {
  count: 1,
  doubled: ({ count }) => count * 2,
  quadrupled: ({ doubled }) => doubled * 2
}
```

## Sync and Async actions--in one
Unifire doesn't care what you do in your actions--it'll handle it. Take, for example, this extremely common workflow:

1. Show a loading indicator
2. Fetch some data
3. Hide the loading indicator

Note that showing a loading indicator is a synchronous state update while fetching data and hiding the loading indicator are both asynchronous. Here's what it looks like in Unifire:

```js
const fetchData = async ({ state }, id) => {
  state.loading = true;
  state.data = await asyncCall(id);
  state.loading = false;
}
```

There are two nice things about this example. First, Unifire does not require you to separate your actions into sync and async bits--just write your code how you want to write it. Second, despite the fact that this action makes three state mutations, Unifire will intelligently batch them into two state updates. When you activate the loading state, Unifire will call all subscribers listening to `state.loading`. Then, when `data` is assigned and `loading` is set back to false, Unifire will call all subscribers listening to one or both of `state.data` and `state.loading`.

Another common workflow might be to pop up a toast that dismisses itself after a few seconds. You can do that with a single action too.

```js
const showToast = ({ state }, message) => {
  state.toast = message;
  setTimeout(() => state.toast = '', 5000);
}
```

## Composable actions

## Subscribe to properties not commits

## Register store modules at runtime for code splitting

##
