import { createContext } from 'preact';
import { useContext, useLayoutEffect, useEffect, useState } from 'preact/hooks';

const StoreContext = createContext();
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function useBase (store, subscriber) {
  if (arguments.length === 1) {
    subscriber = store;
    // Disabling eslint on this line because optionally passing a store should be constant
    store = useContext(StoreContext); // eslint-disable-line react-hooks/rules-of-hooks
  }
  const render = useState();
  if (typeof subscriber === 'string') subscriber = [ subscriber ];
  useIsomorphicLayoutEffect(() => store.subscribe(subscriber, () => render[1]({})), []);
  return [ store, subscriber ];
}

export function useObserver (...args) {
  const [ store, render ] = useBase(...args);
  return render({ ...store.state, fire: store.fire });
}

export function useUnifire (...args) {
  const [ store ] = useBase(...args);
  return [ store.state, store.fire ];
}

export function useUnifireState (...args) {
  const [ store, prop ] = useBase(...args);
  return [ store.state[prop], (val) => store.state[prop] = val ];
}
