export default function Unifire (config) {
  let SUBSCRIPTIONS = {};
  let LISTENERS = [];
  let ACTIONS = {};
  let DEPS = new Set();
  let BARE_STATE = {};

  let STATE = new Proxy(BARE_STATE, {
    get: (state, prop) => isFunc(state[prop]) ? state[prop](STATE) : state[prop],
    set: () => true
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

  let listen = (cb) => LISTENERS.push(cb);

  let set = (delta) => {
    let changedProps = Object.keys(delta).filter((prop) => {
      return delta[prop] !== STATE[prop] && !isFunc(BARE_STATE[prop]);
    });
    if (changedProps.length) {
      let uniqueSubscribers = new Set();
      for (let prop of changedProps) {
        SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
      }
      let prior = deref(STATE);
      deref(delta, BARE_STATE);
      uniqueSubscribers.forEach((sub) => sub(STATE, prior));
      LISTENERS.forEach((cb) => cb(STATE, prior));
    }
  }

  let fire = async (actionName, payload) => {
    return ACTIONS[actionName] && ACTIONS[actionName]({ state: STATE, set }, payload);
  }

  let register = ({ state = {}, actions = {} }) => {
    for (let prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, BARE_STATE);
    for (let prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE)));
      }
    }
  }

  register(config);

  return { state: STATE, subscribe, listen, fire, set, register };
}
