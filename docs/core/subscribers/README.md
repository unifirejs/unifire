# Subscribers

Subscribers allow you to execute a callback when specific state properties change. `store.subscribe` accepts the configurations detailed below. In all cases, the `subscriber` method passed to `store.subscribe` has the following signature:

```js
const subscriber = (state, prior) => { ... };
```

### store.subscribe(subscriber);

```js
store.subscribe(({ a, b }) => { ... });
```

When passed only a subscriber, Unifire will immediately call your subscriber method in order to determine its dependencies (in this case, `a` and `b`). After that, Unifire will only call your subscriber when its state dependencies change.

> When using function-only notation, be aware that there cannot be any conditional state property access. In order for Unifire to detect what dependencies a subscriber has, that subscriber must access all of its dependencies unconditionally. For this reason, it's best to destructure your subscriber's `state` argument, as doing so accesses the properties you need.

### store.subscribe(props, subscriber);

You can also be more explicit and instruct Unifire exactly which properties to listen to.

```js
store.subscribe([ 'a', 'b' ], (state) => { ... });
```

In this case, Unifire will not immediately execute the provided subscriber method because you've already told Unifire which state properties this subscriber depends on.

### Unsubscribing

`store.subscribe` returns an unsibscribe method.

```js
const unsubscribe = store.subscribe(...);
unsubscribe();
```
