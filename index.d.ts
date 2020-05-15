export type State = object;
export type Fire = (string: actionName, payload?: any) => any;
export type Subscriber = (state: State, previous: State) => any;
export type Unsubscriber = () => void;

export interface UnifireConfig {
  state: State;
  actions: ({ state: State, fire: Fire }, payload?: any) => any;
}

export interface Store {
  state: State;
  fire: Fire;
  subscribe: (subscriber: string[] | Subscriber, override: Subscriber) => Unsubscriber;
  register: (config: UnifireConfig) => void;
}

export default function (config: UnifireConfig): Store;
