const keyGenFactory = (...keys) => {
  return (state) => {
    const output = {};
    for (const key of keys) {
      if (state[key]) output[key] = state[key];
    }
    return JSON.stringify(output);
  }
}

const memoize = (func, keyGen) => {
  const memo = {};
  return (state) => {
    const key = keyGen(state);
    return (key in memo)
      ? memo[key]
      : (memo[key] = func(state));
  }
}

const state = {
  count: 1,
  doubled: memoize(({ count }) => count * 2, keyGenFactory('count'))
}

/**********************************************************************************/

// This is almost the same as Unifire's dependency detection code.
// Should this just be another export so memo can use it too? I'm
// confident doing so would increase Unifire's download size.
const getDeps = (state, func) => {
  const deps = new Set();
  const val = func(new Proxy({}, {
    get (_, prop) {
      deps.add(prop);
      return state[prop];
    }
  }), {});
  return [ deps, val ];
}

const keyGen = (state, deps) => {
  const output = {};
  deps.forEach((dep) => {
    if (state[dep]) output[dep] = state[dep];
  });
  return JSON.stringify(output);
}

const memoize = (func) => {
  const memo = {};
  let deps;
  return (state) => {
    let val;
    if (!deps) [ deps, val ] = getDeps(state, func);
    const key = keyGen(state, deps);
    return (key in memo)
      ? memo[key]
      : (memo[key] = val === undefined ? func(state) : val);
  }
}

const state = {
  count: 1,
  doubled: memoize(({ count }) => count * 2)
}
