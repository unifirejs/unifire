import { createContext } from 'preact';
import { useContext, useLayoutEffect, useEffect, useState } from 'preact/hooks';

const StoreContext = createContext();
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useUnifire (render) {
  const store = useContext(StoreContext);
  const state = useState({});

  useIsomorphicLayoutEffect(() => store.subscribe(render, () => state[1]({})), []);

  return render({ ...store.state, fire: store.fire });
}
