import Unifire from '../';

const tick = () => new Promise((resolve) => setTimeout(resolve));

describe('Unifire', () => {
	let state;
	let actions;
	let store;

	beforeEach(() => {
		state = {
			count: 2,
			name: 'joe',
			loading: false,
			doubled: ({ count }) => count * 2,
			quadrupled: ({ doubled }) => doubled * 2,
			object: {},
			array: []
		};

		actions = {
			increment: ({ state }) => state.count++,
			spy: jest.fn(),
			gimme: () => 'hello',
			login: async ({ state }) => {
				state.loading = true;
				await tick();
				state.loading = false;
			},
			composed: async ({ state, fire }) => {
				await fire('login');
				state.count++;
			},
			timeout: ({ state }) => {
				state.count++;
				setTimeout(() => {
					state.count--;
				});
			}
		};

		store = Unifire({ state, actions });
	});

  it('should expose the public API', () => {
    expect(store).toMatchObject({
			state: expect.any(Object),
			subscribe: expect.any(Function),
			listen: expect.any(Function),
			fire: expect.any(Function),
			register: expect.any(Function)
		});
	});

	describe('initialize state and actions', () => {
		it('should init with provided state', () => {
			expect(store.state.count).toBe(state.count);
		});

		it('should init with provided actions', () => {
			expect(store.state.count).toBe(state.count);
			store.fire('increment');
			expect(store.state.count).toBe(state.count + 1);
		});
	});

	describe('state mutation', () => {
		it('should allow direct assignment', () => {
			expect(store.state.count).toBe(state.count);
			store.state.count++;
			expect(store.state.count).toBe(state.count + 1);
		});
	});

	describe('computed properties', () => {
		it('should return a basic computed property for functions in the state object', () => {
			expect(store.state.doubled).toBe(state.count * 2);
		});

		it('should return a complex computed property', () => {
			expect(store.state.quadrupled).toBe(state.count * 4);
		});

		it('should not be able to overwrite computed properties', () => {
			store.state.doubled = -10;
			expect(store.state.doubled).toBe(state.count * 2);
		});
	});

	describe('fire', () => {
		it('should execute the correct action and pass state, fire, and a custom payload', () => {
			store.fire('spy', 'one');
			expect(actions.spy).toHaveBeenCalledTimes(1);
			const [ context, payload ] = actions.spy.mock.calls[0];
			expect(context.state).toBe(store.state);
			expect(context.fire).toBe(store.fire);
			expect(payload).toBe('one');
		});

		it('should return what the action returns', () => {
			expect(store.fire('gimme')).toBe('hello');
		});
	});

	describe('subscribe', () => {
		it('should accept an array of state properties and a callback', async () => {
			const spy = jest.fn();
			store.subscribe([ 'name', 'loading' ], spy);
			await tick();
			expect(spy).toHaveBeenCalledTimes(0);
			store.state.count++;
			await tick();
			expect(spy).toHaveBeenCalledTimes(0);
			store.state.name = 'jophus';
			await tick();
			expect(spy).toHaveBeenCalledTimes(1);
			store.state.loading = true;
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('should execute subscriber function immediately', () => {
			// jest.fn() returns something that fails instancesof Function
			let count = 0;
			const spy = () => count = 1;
			store.subscribe(spy);
			expect(count).toBe(1);
		});

		it('should not immediately call subscriber on state change', async () => {
			const spy = jest.fn();
			store.subscribe(({ count }, prior) => spy(count, prior.count));
			store.state.count++;
			expect(spy).toHaveBeenCalledTimes(1);
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
		});


		it('should subscribe to single-property state changes and pass state and prior', async () => {
			const spy = jest.fn();
			store.subscribe(({ count }, prior) => spy(count, prior.count));
			store.state.count++;
			await tick();
			const [ count, priorCount ] = spy.mock.calls[1];
			expect(count).toBe(state.count + 1);
			expect(priorCount).toBe(state.count);
		});

		it('should unsubscribe', async () => {
			const spy = jest.fn();
			const unsubscribe = store.subscribe(({ count }, prior) => spy(count, prior.count));
			store.state.count++;
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
			unsubscribe();
			store.state.count++;
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it('should not run subscriber when immediate, sequential mutations that no changes', async () => {
			const spy = jest.fn();
			store.subscribe(({ count }, prior) => spy(count, prior.count));
			store.state.count++;
			store.state.count--;
			await tick();
			expect(spy).toHaveBeenCalledTimes(1);
		});

		it('should only run subscriber once for immediate, sequential mutations that yield changes', async () => {
			const spy = jest.fn();
			store.subscribe(({ count }, prior) => spy(count, prior.count));
			store.state.count++;
			store.state.count++;
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
			const [ count, priorCount ] = spy.mock.calls[1];
			expect(count).toBe(state.count + 2);
			expect(priorCount).toBe(state.count);
		});

		it('should run subscriber twice for a mutation before and after an async behavior', async () => {
			const spy = jest.fn();
			store.subscribe(({ count }, prior) => spy(count, prior.count));
			store.state.count++;
			await tick();
			store.state.count++;
			await tick();
			expect(spy).toHaveBeenCalledTimes(3);
			const [ count1, priorCount1 ] = spy.mock.calls[1];
			expect(count1).toBe(state.count + 1);
			expect(priorCount1).toBe(state.count);
			const [ count2, priorCount2 ] = spy.mock.calls[2];
			expect(count2).toBe(state.count + 2);
			expect(priorCount2).toBe(state.count + 1);
		});

		it('should subscribe to multi-property state changes', async () => {
			const spy = jest.fn();
			store.subscribe(({ count, name }, prior) => spy(count, name, prior.count, prior.name));

			// Calls subscriber once when state.count changes
			store.state.count++;
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
			const [ count1, name1, priorCount1, priorName1 ] = spy.mock.calls[1];
			expect(count1).toBe(state.count + 1);
			expect(name1).toBe(state.name);
			expect(priorCount1).toBe(state.count);
			expect(priorName1).toBe(state.name);

			// Calls subscriber once when state.name changes
			store.state.name = 'jophus';
			await tick();
			expect(spy).toHaveBeenCalledTimes(3);
			const [ count2, name2, priorCount2, priorName2 ] = spy.mock.calls[2];
			expect(count2).toBe(state.count + 1);
			expect(name2).toBe('jophus');
			expect(priorCount2).toBe(state.count + 1);
			expect(priorName2).toBe(state.name);
		});

		it('should only call multi-property subscriber once when both properties encounter immediate, sequential mutations', async () => {
			const spy = jest.fn();
			store.subscribe(({ count, name }, prior) => spy(count, name, prior.count, prior.name));

			// Calls subscriber once when both state.count and state.name change
			store.state.count++;
			store.state.name = 'jophus';
			await tick();
			expect(spy).toHaveBeenCalledTimes(2);
			const [ count, name, priorCount, priorName ] = spy.mock.calls[1];
			expect(count).toBe(state.count + 1);
			expect(name).toBe('jophus');
			expect(priorCount).toBe(state.count);
			expect(priorName).toBe('joe');
		});

		it('should subscribe to basic computed property changes', async () => {
			const spy = jest.fn();
			store.subscribe(({ doubled }, prior) => spy(doubled, prior.doubled));
			store.state.count++;
			await tick();
			const [ doubled, priorDoubled ] = spy.mock.calls[1];
			expect(doubled).toBe((state.count + 1) * 2);
			expect(priorDoubled).toBe(state.count * 2);
		});

		it('should subscribe to complex computed property changes', async () => {
			const spy = jest.fn();
			store.subscribe(({ quadrupled }, prior) => spy(quadrupled, prior.quadrupled));
			store.state.count++;
			await tick();
			const [ quadrupled, priorQuadrupled ] = spy.mock.calls[1];
			expect(quadrupled).toBe((state.count + 1) * 4);
			expect(priorQuadrupled).toBe(state.count * 4);
		});

		it('should allow passing an override function to be used instead of the subscriber method', async () => {
			const subScriberSpy = jest.fn();
			const overrideSpy = jest.fn();
			const subscriber = ({ count }, prior) => subScriberSpy(count, prior.count);
			const override = ({ count }, prior) => overrideSpy(count, prior.count);
			store.subscribe(subscriber, override);

			expect(subScriberSpy).toHaveBeenCalledTimes(1);
			expect(overrideSpy).toHaveBeenCalledTimes(0);

			store.state.count++;
			await tick();
			expect(subScriberSpy).toHaveBeenCalledTimes(1);
			expect(overrideSpy).toHaveBeenCalledTimes(1);
			const [ count, priorCount ] = overrideSpy.mock.calls[0];
			expect(count).toBe(state.count + 1);
			expect(priorCount).toBe(state.count);
		});
	});

	describe('listen', () => {
		it('should accept and call listener on every state change', async () => {
			const spy = jest.fn();
			store.listen(spy);

			store.state.count++;
			await tick();
			let [ state, prior ] = spy.mock.calls[0];
			expect(state.count).toBe(store.state.count);
			expect(prior.count).toBe(store.state.count - 1);

			store.state.name = 'yo';
			await tick();
			[ state, prior ] = spy.mock.calls[1];
			expect(state.name).toBe('yo');
			expect(prior.name).toBe('joe');
		});
	});

	describe('register', () => {
		it('should not throw', () => {
			store.register({});
		});

		it('should register new state and actions', () => {
			const lazyState = { lazyCount: 0 };
			const lazyActions = {
				lazyIncrement: ({ state }) => state.lazyCount++
			}
			store.register({ state: lazyState, actions: lazyActions });
			expect(store.state.count).toBe(state.count);
			expect(store.state.lazyCount).toBe(lazyState.lazyCount);
			store.fire('lazyIncrement');
			expect(store.state.count).toBe(state.count);
			expect(store.state.lazyCount).toBe(lazyState.lazyCount + 1);
			store.fire('increment');
			expect(store.state.count).toBe(state.count + 1);
		});
	});

	describe('actions', () => {
		it('should allow sync/async mutations in a single action', async () => {
			store.fire('login');
			expect(store.state.loading).toBe(true);
			await tick();
			expect(store.state.loading).toBe(false);
		});

		it('should allow sync/async action composition', async () => {
			store.fire('composed');
			expect(store.state.loading).toBe(true);
			await tick();
			expect(store.state.loading).toBe(false);
			expect(store.state.count).toBe(state.count + 1);
		});

		it('should allow actions that use setTimeout', async () => {
			store.fire('timeout');
			expect(store.state.count).toBe(state.count + 1);
			await tick();
			expect(store.state.count).toBe(state.count);
		});
	});
});
