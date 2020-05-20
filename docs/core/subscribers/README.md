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

> There's an important difference between passing just a function and passing an array and a function. When you pass just a function, Unifire immediately runs your subscriber in order to determine its dependencies. When you pass an array of dependencies, Unifire does not immediately run your subscriber.

> Also, when using function-only notation, be aware that there cannot be any conditional state property access. In order for Unifire to detect what dependencies a subscriber has, that subscriber must access all of its dependencies unconditionally.

Subscribers also receive the prior state object.

```js
store.subscribe(({ a, b }, prior) => { ... });
```

`store.subscribe` returns an unsibscribe method.

```js
const unsubscribe = store.subscribe(...);
unsubscribe();
```
