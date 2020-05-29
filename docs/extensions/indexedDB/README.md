# unifire-idb

```js
import { get, set } from 'idb-keyval';

const unifireIDB = (store, config) => {
  const state = {};
  const subscribers = [];
  for (const prop in config) {
    state[prop] = get(prop) || config[prop];
    subscribers.push((state) => set(prop, state[prop]));
  }
  store.register({ state });
  subscribers.forEach((sub) => store.subscribe(sub));
};

unifireIDB(store, {
  dark: false,
  timestamp: undefined
});
```
