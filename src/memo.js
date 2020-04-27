const memoize = (func) => {
  const memo = {};

  return () => {
    const args = [].concat(arguments);

    return (args in memo)
      ? memo[args]
      : (memo[args] = func.apply(this, args));
  }
}
