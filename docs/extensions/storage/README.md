# unifire-browser-storage

```js
const unifireBrowserStorage = (store, config, engine = localStorage) => {
  const state = {};
  const subscribers = [];
  for (const prop in config) {
    state[prop] = JSON.parse(engine.getItem(prop)) || config[prop];
    subscribers.push((state) => engine.setItem(prop, JSON.stringify(state[prop])));
  }
  store.register({ state });
  subscribers.forEach((sub) => store.subscribe(sub));
};

unifireBrowserStorage(store, {
  dark: false,
  timestamp: undefined
});
```
