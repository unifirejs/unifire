import { h, Component } from 'preact';

export function Provider (props) {
	this.getChildContext = () => ({ store: props.store });
}
Provider.prototype.render = props => props.children && props.children[0] || props.children;

export function Observer (component) {
  function Wrapper(_, { store }) {
    let unsubscribe;
    this.componentDidMount = () => {
      unsubscribe = store.subscribe(component, () => {
        console.log('OBSERVER');
        this.setState({});
      });
    };
    this.componentWillUnmount = () => unsubscribe();
    this.render = () => h(component, { ...store.state, fire: store.fire });
  }
  return (Wrapper.prototype = new Component()).constructor = Wrapper;
}
