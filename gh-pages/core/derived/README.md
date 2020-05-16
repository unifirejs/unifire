# Derived State

Derived state, also called computed properties, are values that depend on other state properties. Let's continue with our counter store from the State section and add a derived state property that doubles count.

```js
const state = {
  count: 0,
  doubled: ({ count }) => count * 2
};

const counter = Unifire({ state });
```

Unifire expects that any functions present in the state object are computed properties. When Unifire encounters a derivation function, it determines that function's state dependencies (in this case `count`). When any of those dependencies change, Unifire executes all of the derivation's subscribers.

For example, the following subscriber will only run when `count` changes.

```js
store.subscribe(({ doubled }) => console.log('doubled', doubled));
```

Derived state can depend on other derived state.

```js
const state = {
  count: 1,
  doubled: ({ count }) => count * 2,
  quadrupled: ({ doubled }) => doubled * 2
}
```

Unifire does not support making assignments to derived state.
