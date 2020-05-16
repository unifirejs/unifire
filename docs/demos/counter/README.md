# Counter

This example shows how to create a Preact counter component using a shareable Unifire store and one of Unifire's Preact hooks.

Specifics about Unifire's Preact hooks and HOCs can be found in Unifire's Preact documentation.

```js
import { h } from 'preact';
import Unifire from 'unifire';
import { useUnifireState } from 'unifire-preact';

const counterStore = Unifire({
  state: { count: 0 }
});

export const Counter = () => {
  const [ count, setCount ] = useUnifireState(counterStore, 'count');
  return (
    <>
      <button onClick={() => setCount(count - 1)}>-</button>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  );
};
```
