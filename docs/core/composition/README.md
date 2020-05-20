# Composing Stores

In the event that you've opted to go with a multi-store setup, you may encounter scenarios in which you need one store to communicate with another. You can accomplish this easily by having one store subscribe to another store. Let's try a simple demo.

For this (contrived) example, let's pretend we have a shopping list app. We'll use one store to represent the currently logged-in user and another to represent that user's shopping list. The shopping list store needs to know any time the user store's `userId` property changes. If it changes to a non-`null` value, we'll take that value and use it to fetch the user's shopping list from an endpoint. If `userId` changes to `null`, we'll delete all the data we have saved.

Let's start with the user store.

```js
// stores/user.js

import Unifire from 'unifire';

const state = { userId: null };
export default Unifire({ state });
```

Now let's create the shopping list store.

```js
// stores/shoppingList.js

import Unifire from 'unifire';
import userStore from '../user.js'
import Shop from '../../services/shopping';

const state = { items: [] };

const actions = {
  fetchItems: async ({ state }, userId) => {
    state.items = await Shop.getItemsFor(userId)
  },

  reset: ({ state }) => state.items = []
};

const shoppingListStore = Unifire({ state, actions });

userStore.subscribe(({ userId }) => {
  const action = userId ? 'fetchItems' : 'reset';
  shoppingListStore.fire(action, userId);
});

export default shoppingListStore;
```

Notice that `shoppingList.js` imports `userStore` and subscribes direcly to it. Now any time `userStore.state.userId` changes, `shoppingListStore` will fetch or reset its list of items.
