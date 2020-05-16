# Actions

Unifire has no limitations on what you can do in your actions. Write your code however you want to write it. Unifire will call the right subscribers at the right time.

## Basics

```js
const state = { count: 0 };

const actions = {
  increment: ({ state }) => state.count++,
  decrement: ({ state }) => state.count--
};

const counter = Unifire({ state, actions });
```

To call an action, call `fire`.

```js
counter.fire('increment');
```

If your action returns a value, `fire` will return that same value.

## Custom Params

Actions often require additional context to run. You can provide a custom argument as follows.

```js
const actions = {
  sum: ({ state }, num) => state.count+= num
};

counter.fire('sum', 2);
```

## Async Actions

Showing a loading state while fetching some data is an extremely common practice. Let's build it!

```js
const state = {
  loading: false,
  data: null
};

const actions = {
  fetchData: async ({ state }, id) => {
    state.loading = true;
    state.data = await asyncCall(id);
    state.loading = false;
  }
};

const store = Unifire({ state, actions });

store.fire('fetchData', 1);
```

There are two nice things about this example. First, Unifire does not require you to separate your actions into sync and async bits--just write your code how you want to write it. Second, despite the fact that this action makes three state mutations, Unifire will intelligently batch them into two state updates--one to set `state.loading` to `true`, and another to assign `state.data` and set `state.loading` back to `false`.

Another common workflow might be to pop up a toast that dismisses itself after a few seconds. You can do that with a single action too.

```js
const actions = {
  showToast: ({ state }, message) => {
    state.toast = message;
    setTimeout(() => state.toast = '', 5000);
  }
};

store.fire('showToast');
```

## Composing Actions

Sometimes it can be useful to chain actions together. Unifire makes this easy. Use the `fire` param made available to all actions.

```js
const actions = {
  actionA: async ({ state }) => {
    state.someVal = await asyncCall();
  },

  actionB: async ({ state, fire }) => {
    await fire('actionA');
    state.someOtherVal = true;
  }
}

store.fire('actionB');
```
