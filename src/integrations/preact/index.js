import { h, Component, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const StoreContext = createContext();

export const Provider = StoreContext.Provider;

export function Observer (store, component) {
  if (arguments.length === 1) {
    component = store;
    // Disabling eslint on this line because optionally passing a store should be constant
    store = useContext(StoreContext); // eslint-disable-line react-hooks/rules-of-hooks
  }
  function Wrapper() {
    let unsubscribe;
    this.componentDidMount = () => {
      unsubscribe = store.subscribe(component, () => this.setState({}));
    };
    this.componentWillUnmount = () => unsubscribe();
    this.render = (props) => h(component, { ...props, ...store.state, fire: store.fire });
  }
  return (Wrapper.prototype = new Component()).constructor = Wrapper;
}
