export const reflect = (state, func) => {
  const deps = new Set();
  const val = func(new Proxy({}, {
    get (_, prop) {
      deps.add(prop);
      return state[prop];
    }
  }), {});
  return [ deps, val ];
}
