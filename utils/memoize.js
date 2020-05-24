import { reflect } from './reflect';

const keyGen = (state, deps) => {
  const output = {};
  deps.forEach((dep) => {
    if (state[dep]) output[dep] = state[dep];
  });
  return JSON.stringify(output);
}

export const memoize = (func) => {
  const memo = {};
  let deps;
  return (state) => {
    let val;
    if (!deps) [ deps, val ] = reflect(state, func);
    const key = keyGen(state, deps);
    return (key in memo)
      ? memo[key]
      : (memo[key] = val === undefined ? func(state) : val);
  }
}
