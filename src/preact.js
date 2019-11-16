import { createContext } from 'preact';
import { useLayoutEffect, useEffect, useState, useMemo } from 'preact/hooks';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useUnifire (keys, shouldUpdate) {
  const store = hooks.useContext(createContext());
  const [ _, setState ] = useState({});

  useIsomorphicLayoutEffect(() => {
    const cb = (changedKeys, before, after) => {
      if(shouldUpdate){
        if(!shouldUpdate(before, after)) return;
      }
      const changeInKeys = keys.some(key => changedKeys.includes(key));
      if (changeInKeys) setState({});
    }
    return store.subscribe(cb);
  }, [])

  return useMemo(() => {
    const data = {};
    keys.forEach(key => data[key] = STATE[key]);
    return [ data, fire ];
  }, [ _ ])
};
