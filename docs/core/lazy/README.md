# Code Splitting

Unifire allows you to lazily reigster store modules whenever you want. This enables you to split your state management into logical chunks so your pages load faster!

All store modules get merged into the top level so be certain you don't have naming conflicts.

```js
// Instantiate your store
const store = Unifire(...);

// Later, register additional modules
store.register({ lazyState, lazyActions });
```
