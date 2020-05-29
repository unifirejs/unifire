# Listeners

Sometimes you need to subscribe to all state changes. In order to do that, call `store.listen`.

```js
store.listen((state, prior) => { /* Called on every state change */ });
```

Unifire does not currently support removing a listener.
