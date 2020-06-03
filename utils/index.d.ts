export type Memoize = (func: (object) => any) => (object) => any;
export type Reflect = (state: object, func: (object) => any) => [ Set<string, any>, any ];

export default { memoize: Memoize, reflect: Reflect };
