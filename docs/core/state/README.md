# State

Each Unifire instance accepts `state` which must be an object.

```js
const state = {
  count: 0
};

const counter = Unifire({ state });
```

Now that we have our counter, we need to be able to interact with it.

To read state from your store, just access it.

```js
const currentCount = counter.state.count;
```

To write to your store, just mutate state;

```js
counter.state.count = 1;
```

To subscribe to changes to `counter.state.count`, call subscribe and access `count`.

```js
counter.subscribe(({ count }) => console.log('count', count));
```

This subscriber will only be called when `counter.state.count` changes. (For more on subscribers, see the Subscribers section.)

When making assignments to non-primitives such as objects or arrays, be certain to change the value's memory address or the mutation will not trigger subscribers.

```js
// Setup our store with an object and an array
const state = {
  obj: { a: 'a', b: 'b' },
  arr: [ 1, 2 ]
};

const counter = Unifire({ state });

// Mutate the object
store.state.obj = { ...state.obj, { c: 'c' } };

// Mutate the array
store.state.arr = [ ...state.arr, ...[ 3 ] ];
```
