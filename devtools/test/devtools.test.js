import { tick } from '../';

it('should delay execution by a tick', async () => {
  let count = 0;
  setTimeout(() => count = 1);
  expect(count).toBe(0);

  count = 0;
  setTimeout(() => count = 1);
  await tick();
  expect(count).toBe(1);
});
