# Quick Start

Here's a quick taste to get started.

> For more detailed documentation about Unifire, read the [Core Concepts](/core/state/) docs.
>
>For information about Unifire's framework integrations, read the [Integrations](/integrations/preact/) docs.

Creating a basic store is easy. Let's build a counter.

```js
import Unifire from 'unifire';

const state = { count: 1 };
const store = Unifire({ state });
```

To change the store's value, just mutate it.

```js
store.state.count++;
```

To use derived state, just pass a function in your state object.

```js
const state = {
  count: 1,
  doubled: ({ count }) => count * 2
};
const store = Unifire({ state });

console.log(store.state.doubled); // -> 2
```

To make a collection of state mutations available at a store level, create actions.

```js
const actions = {
  increment: ({ state }) => state.count++,
  decrement: ({ state }) => state.count--
};
const store = Unifire({ state, actions });
```

To execute actions, call `store.fire`.

```js
store.fire('increment');
console.log(store.state.count); // -> 2
```

Async actions have never been easier.

```js
const actions = {
  fetchCount: async ({ state }) => {
    state.count = await someAsyncCall();
  }
};
```

To subscribe to changes to specific state properties, call `store.subscribe`.

```js
store.subscribe(({ count }) => console.log('count', count));
```

To subscribe to all state changes, call `store.listen`.

```js
store.listen((state) => console.log('change', state));
```
