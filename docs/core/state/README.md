# State

Unifire is flexible. You can use it as a single-store, app-wide state management system or you can create multiple stores and subscribe to them as needed throughout your application. Regardless of how you choose to use Unifire, each instance accepts `state` which must be an object.

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
