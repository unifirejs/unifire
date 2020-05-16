# Subscribers

Subscribers allow you to discover when specific state properties change. The subscribe method's signature is flexible allowing either of the following uses.

>Unifire.subscribe(subscriber);
>
>Unifire.subscribe(props, subscriber);

In the following scenario, Unifire will determine which state properties the provided subscriber method needs and only call that method when one or more of those properties changes.

```js
store.subscribe(({ a, b }) => { ... });
```

You can also be more explicit and instruct Unifire exactly which properties to listen to.

```js
store.subscribe([ 'a', 'b' ], (state) => { ... });
```

Subscribers also receive the prior state object.

```js
store.subscribe(({ a, b }, prior) => { ... });
```

`store.subscribe` returns an unsibscribe method.

```js
const unsubscribe = store.subscribe(...);
unsubscribe();
```
