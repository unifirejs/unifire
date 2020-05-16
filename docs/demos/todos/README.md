# Todos

In the Counter example, we wrote our store and compoennt in the same file. Let's put our store and component in separate files for this demo.

Let's start with the todos store.

```js
// stores/todos.js

import Unifire from 'unifire';

const state = { todos: [] };

const actions = {
  addTodo: ({ state }, name) => state.todos = [ ...state.todos, ...[ new Todo(name) ] ],

  removeTodo: ({ state }, id) => state.todos = state.todos.filter((item) => item.id !== id),

  toggleTodo: ({ state }, id) => {
    state.todos = state.todos.map((item) => {
      if (item.id === id) item.done = !item.done;
      return item;
    });
  }
}

export const todoStore = Unifire({ state, actions });
```

Now we'll write our component. __NOTE__ that this example assumes we're using `unifire-preact`'s `Provider` component at the application root.

```js
// components/todos.js

import { h } from 'preact';
import { useState } from 'preact/hooks';
import style from './style';
import { Observer } from '../../js/unifire/preact';

const Todos = ({ todos, fire }) => {
  const [ name, setName ] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    fire('addTodo', name);
    setName('');
  }

  return (
    <>
      <form onSubmit={(e) => onSubmit(e)}>
        <input onInput={(e) => setName(e.target.value)} />
      </form>

      <ul>
        { todos.map((item) => (
          <li>
            <button onClick={() => fire('toggleTodo', item.id)}>Toggle</button>
            <span class={item.done ? style.done : ''}>{item.name}</span>
            <button onClick={() => fire('removeTodo', item.id)}>X</button>
          </li>
        )) }
      </ul>
    </>
  );
}

export default Observer(Todos);
```