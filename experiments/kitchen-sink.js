/**
 * This version has the following features added
 * 1. subscribers can be passed to register
 * 2. listen is now available as a public method and a param to register
 */

import { reflect } from '../utils';

export default function Unifire (config) {
  let SUBSCRIPTIONS = {};
  let ACTIONS = {};
  let BARE_STATE = {};
  let LISTENERS = [];
  let PENDING_DELTA = {};
  let prior;
  let timeout;

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
    let deps = cb instanceof Array ? cb : reflect(STATE, cb)[0];
    deps.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].add(override || cb));
    return () => deps.forEach((dep) => SUBSCRIPTIONS[dep] && SUBSCRIPTIONS[dep].delete(override || cb));
  }

  let listen = (cb) => LISTENERS.push(cb);

  let callUniqueSubscribers = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      let uniqueSubscribers = new Set();
      for (let prop in PENDING_DELTA) {
        PENDING_DELTA[prop] !== prior[prop]
        && SUBSCRIPTIONS[prop]
        && SUBSCRIPTIONS[prop].forEach((sub) => uniqueSubscribers.add(sub));
      }
      let list = new Set(uniqueSubscribers, LISTENERS);
      list.forEach((sub) => sub(STATE, prior));
      PENDING_DELTA = {};
      prior = deref(STATE);
    });
  }

  let fire = (actionName, payload) => {
    return ACTIONS[actionName] && ACTIONS[actionName]({ state: STATE, fire }, payload);
  }

  let register = ({ state = {}, actions = {}, subscribers = [], listeners = [] }) => {
    for (let prop in state) SUBSCRIPTIONS[prop] = new Set();
    deref(actions, ACTIONS);
    deref(state, STATE);
    prior = deref(STATE);
    for (let prop in state) {
      if (isFunc(state[prop])) {
        subscribe(state[prop], () => SUBSCRIPTIONS[prop].forEach((sub) => sub(STATE, prior)));
      }
    }
    subscribers.forEach(subscribe);
    listeners.forEach(listen);
  }

  register(config);

  return { state: STATE, fire, subscribe, listen, register };
}
