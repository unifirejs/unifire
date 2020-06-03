import { memoize, reflect } from '../';

describe('Utils', () => {
  beforeEach(() => {});

  it('should expose the public API', () => {
    expect(memoize).toBeInstanceOf(Function);
    expect(reflect).toBeInstanceOf(Function);
  });

	describe('memoize', () => {
    let state;
    let func;

    beforeEach(() => {
      state = { a: 'a', b: 'b', c: 'c', d: 'd' };
      const obj = {
        func: ({ a, c }) => a + c
      };
      func = spyOn(obj, 'func').and.callThrough();
    });

		it('should return a function', () => {
      expect(memoize(jest.fn())).toBeInstanceOf(Function);
    });

    it('should return the correct value', () => {
      const memoized = memoize(func);
      expect(memoized(state)).toBe(state.a + state.c);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should only call the inner function once', () => {
      const memoized = memoize(func);
      memoized(state);
      memoized(state);
      expect(func).toHaveBeenCalledTimes(1);
    });

    it('should call the inner function again once one of its dependencies change', () => {
      const memoized = memoize(func);
      memoized(state);
      memoized(state);
      state.c = 'cc';
      memoized(state);
      expect(func).toHaveBeenCalledTimes(2);
		});
  });

  describe('reflect', () => {
		it('should return a function\'s dependencies and output', () => {
      const state = { a: 'a', b: 'b', c: 'c', d: 'd' };
      const func = ({ a, c }) => a + c;
      const [ deps, output ] = reflect(state, func);
      expect(deps.size).toBe(2);
      expect(deps.has('a')).toBe(true);
      expect(deps.has('c')).toBe(true);
      expect(output).toBe(state.a + state.c);
		});
	});
});
