// import { reflect } from './utils';

export default function Unifire (config) {
  let BARE_STATE = {};
  let SUBSCRIPTIONS = {};
  let ACTIONS = {};
  let PENDING_DELTA = {};
  let LISTENERS = [];
  let prior;
  let timeout;

  let get = (state, prop, proxy) => isFunc(state[prop]) ? state[prop](proxy) : state[prop];

  let setPrior = () =>  prior = new Proxy(deref(BARE_STATE), { get });

  let isFunc = (val) => val instanceof Function;

  let deref = (obj, target = {}) => Object.assign(target, obj);

  let STATE = new Proxy(BARE_STATE, {
    get,
    set (state, prop, next) {
      if (!isFunc(state[prop])) {
        state[prop] = PENDING_DELTA[prop] = next;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          let uniqueSubscribers = new Set();
          for (let prop in PENDING_DELTA) {
            PENDING_DELTA[prop] !== prior[prop]
            && SUBSCRIPTIONS[prop]
            && SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
          }
          uniqueSubscribers.forEach((sub) => sub(STATE, prior));
          LISTENERS.forEach((cb) => cb(STATE, prior));
          PENDING_DELTA = {};
          setPrior();
        });
      }
      return true;
    }
  });

  let subscribe = (deps, cb) => {
    let props = deps;
    if (isFunc(deps)) {
      props = new Set();
      deps(new Proxy({}, {
        get (_, prop) {
          props.add(prop);
          return STATE[prop];
        }
      }), prior);
    }
    // let props = isFunc(deps) ? reflect(STATE, deps)[0] : deps;
    props.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(cb || deps));
    return () => props.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(cb || deps));
  }

  let listen = (cb) => LISTENERS.push(cb);

  let fire = (actionName, payload) => {
    return ACTIONS[actionName] && ACTIONS[actionName]({ state: STATE, fire }, payload);
  }

  let register = ({ state = {}, actions = {} }) => {
    for (let prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, BARE_STATE);
    setPrior();
    for (let prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, prior)));
      }
    }
  }

  register(config);

  return { state: STATE, fire, subscribe, listen, register };
}

// const unifireLocalStorage = (store, config) => {
//   const state = {};
//   const subscribers = [];
//   for (const prop in config) {
//     state[prop] = JSON.parse(localStorage.getItem(prop)) || config[prop];
//     subscribers.push((state) => localStorage.setItem(prop, JSON.stringify(state[prop])));
//   }
//   store.register({ state });
//   subscribers.forEach((sub) => store.subscribe(sub));
// };

// unifireLocalStorage(store, {
//   dark: false,
//   timestamp: undefined
// });
