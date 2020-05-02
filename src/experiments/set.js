export const Unifire = (config) => {
  const SUBSCRIPTIONS = {};
  const ACTIONS = {};
  const DEPS = new Set();
  const BARE_STATE = {};

  const STATE = new Proxy(BARE_STATE, {
    get (state, prop) {
      return isFunc(state[prop]) ? state[prop](STATE) : state[prop]
    },
    set (/*state, prop, next*/) {
      // if (!isFunc(state[prop]) && state[prop] !== next) {
      //   set({ [prop]: next });
      // }
      return true;
    }
  });

  const isFunc = (val) => val instanceof Function;

  const deref = (obj, target = {}) => Object.assign(target, obj);

  const subscribe = (cb, override) => {
    DEPS.clear();
    cb(new Proxy(obj, {
      get (_, prop) {
        DEPS.add(prop);
        return STATE[prop];
      }
    }), {});
    DEPS.forEach((dep) => SUBSCRIPTIONS[dep].add(override || cb));
    return () => DEPS.forEach((dep) => SUBSCRIPTIONS[dep].delete(override || cb));
  }

  const set = (delta) => {
    const changedProps = Object.keys(delta).filter((prop) => {
      return delta[prop] !== STATE[prop] && !isFunc(BARE_STATE[prop]);
    });
    if (changedProps.length) {
      const uniqueSubscribers = new Set();
      for (const prop of changedProps) {
        SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
      }
      const prior = deref(STATE);
      deref(delta, BARE_STATE);
      uniqueSubscribers.forEach((sub) => sub(STATE, { prior }));
    }
  }

  const fire = async (actionName, payload) => {
    const action = ACTIONS[actionName];
    return action && action({ state: STATE, set }, payload);
  }

  const register = ({ state = {}, actions = {} }) => {
    for (const prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, STATE);
    for (const prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE)));
      }
    }
  }

  register(config);

  return { state: STATE, subscribe, fire, register, set };
}
