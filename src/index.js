export default function Unifire (config) {
  let SUBSCRIPTIONS = {};
  let ACTIONS = {};
  let DEPS = new Set();
  let BARE_STATE = {};
  let PENDING_DELTA = {};
  let prior;

  let STATE = new Proxy(BARE_STATE, {
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

  let isFunc = (val) => val instanceof Function;

  let deref = (obj, target = {}) => Object.assign(target, obj);

  let subscribe = (cb, override) => {
    DEPS.clear();
    cb(new Proxy({}, {
      get (_, prop) {
        DEPS.add(prop);
        return STATE[prop];
      }
    }), {});
    DEPS.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(override || cb));
    return () => DEPS.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(override || cb));
  }

  let debounce = (func) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply({}, args));
    };
  }

  let callUniqueSubscribers = debounce(() => {
    let uniqueSubscribers = new Set();
    for (let prop in PENDING_DELTA) {
      SUBSCRIPTIONS[prop] && SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
    }
    uniqueSubscribers.forEach((sub) => sub(STATE, prior));
    PENDING_DELTA = {};
    prior = deref(STATE);
  })

  let fire = (actionName, payload) => {
    return ACTIONS[actionName] && ACTIONS[actionName]({ state: STATE, fire }, payload);
  }

  let register = ({ state = {}, actions = {} }) => {
    for (let prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, STATE);
    for (let prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, prior)));
      }
    }
    prior = deref(STATE);
  }

  register(config);

  return { state: STATE, fire, subscribe, register };
}
