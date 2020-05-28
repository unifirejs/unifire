export default function Unifire (config) {
  const SUBSCRIPTIONS = {};
  const ACTIONS = {};
  const BARE_STATE = {};
  let PENDING_DELTA = {};
  let prior;
  let timeout;

  const STATE = new Proxy(BARE_STATE, {
    get (state, prop) {
      return isFunc(state[prop]) ? state[prop](STATE) : state[prop]
    },
    set (state, prop, next) {
      if (!isFunc(state[prop]) && state[prop] !== next) {
        state[prop] = PENDING_DELTA[prop] = next;
        callUniqueSubscribers();
      }
      return true;
    }
  });

  const isFunc = (val) => val instanceof Function;

  const deref = (obj, target = {}) => Object.assign(target, obj);

  const subscribe = (deps, cb, immediate) => {
    if (isFunc(deps)) {
      LISTENERS.push(cb);
      if (cb) cb(STATE, prior);
      return () => LISTENERS = LISTENERS.filter((sub) => sub !== cb);
    }
    deps.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(cb));
    if (immediate) cb(STATE, prior);
    return () => deps.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(cb));
  }

  const callUniqueSubscribers = () => {
    // Inlining the debounce function is smaller
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const uniqueSubscribers = new Set();
      for (const prop in PENDING_DELTA) {
        PENDING_DELTA[prop] !== prior[prop]
        && SUBSCRIPTIONS[prop]
        && SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
      }
      uniqueSubscribers.forEach((sub) => sub(STATE, prior));
      PENDING_DELTA = {};
      prior = deref(STATE);
    });
  }

  const fire = (actionName, payload) => {
    return ACTIONS[actionName] && ACTIONS[actionName]({ state: STATE, fire }, payload);
  }

  const register = ({ state = {}, computed = {}, actions = {} }) => {
    for (const prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, STATE);
    prior = deref(STATE);
    for (const prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, prior)));
      }
    }
  }

  register(config);

  return { state: STATE, fire, subscribe, register };
}
