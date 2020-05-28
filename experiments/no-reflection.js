export default function Unifire (config) {
  const SUBSCRIPTIONS = {};
  const ACTIONS = {};
  const BARE_STATE = {};
  let LISTENERS = [];
  let PENDING_DELTA = {};
  let prior;
  let timeout;

  const STATE = new Proxy(BARE_STATE, {
    get (state, prop) {
      return isComputed(state[prop]) ? state[prop].cb(STATE) : state[prop]
    },
    set (state, prop, next) {
      if (!isComputed(state[prop]) && state[prop] !== next) {
        state[prop] = PENDING_DELTA[prop] = next;
        callUniqueSubscribers();
      }
      return true;
    }
  });

  const computed = (deps, cb) => ({ computed, deps, cb });

  const isComputed = (val) => val.computed === computed;

  const deref = (obj, target = {}) => Object.assign(target, obj);

  const subscribe = (deps, cb) => {
    if (cb instanceof Function) {
      deps.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(cb));
      // if (immediate) cb(STATE, prior);
      return () => deps.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(cb));
    }
    LISTENERS.push(deps);
    // if (cb) deps(STATE, prior);
    return () => LISTENERS = LISTENERS.filter((listener) => listener !== deps);
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
      LISTENERS.forEach((cb) => cb(STATE, prior));
      PENDING_DELTA = {};
      prior = deref(STATE);
    });
  }

  const fire = (actionName, payload) => {
    return ACTIONS[actionName] && ACTIONS[actionName]({ state: STATE, fire }, payload);
  }

  const register = ({ state = {}, actions = {} }) => {
    for (const prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, STATE);
    prior = deref(STATE);
    for (const prop in state) {
      if (isComputed(state[prop])) {
        subscribe(state[prop].deps, () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, prior)));
      }
    }
  }

  register(config);

  return { state: STATE, fire, subscribe, register, computed };
}
