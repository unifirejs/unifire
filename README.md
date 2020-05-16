# unifire


[![Build Status](https://travis-ci.org/jpodwys/unifire.svg?branch=master)](https://travis-ci.org/jpodwys/unifire)
[![codecov](https://codecov.io/gh/jpodwys/unifire/branch/master/graph/badge.svg)](https://codecov.io/gh/jpodwys/unifire)

## These docs are currently a work in progress

# Table of Contents
* Features
* Guide
* Counter App
* Todo App
* Integrations
* API

## Features

__Tiny__ 400 (brotli-compressed) bytes. No dependencies.

__Simple__ Including the constructor, Unifire has four public methods and one public property.

__Flexibile__ From single-store global state management all the way to a per-model multi-store setup, Unifire's got you covered.

__TypeScript support__ The types are strong with this one. (This is my first time making a `d.ts` file, so contributions are appreciated.)

__Efficient__ Unifire only calls a subscriber when one of its dependencies changes. If multiple dependencies change, it still only calls each applicable subscriber once.

__Derived state__ Also referred to as "computed properties," Unifire allows you to subscribe directly to store-level derivations.

__Sync and Async actions--in one__ Unifire doesn't care what your actions do--combine sync, async, even setTimeout calls into a single action--Unifire will call the right subscribers at the right time.

__Batched updates__ Immediate, sequential updates get batched so that subscribers get called only when necessary.

__Composable actions__ Call actions from other actions. Or don't.

__Subscribe to properties not commits__ Unifire allows you to subscribe to one or more properties directly.

__Register store modules at runtime__ Code-splitting is a first-class concern. Keep your state and actions where they belong and load them only when you need them.



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
