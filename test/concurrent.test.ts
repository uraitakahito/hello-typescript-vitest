/* eslint-disable no-console */

//
// NOTE:
// `vitest run --silent`: Silent console output from tests
//

//
// Reference:
// https://pc.atsuhiro-me.net/entry/2022/02/28/163920
//

// eslint-disable-next-line no-promise-executor-return
const sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

beforeAll(async () => {
  await sleep(100);
  console.log('beforeAll() complete.');
});

beforeEach(async () => {
  await sleep(100);
  console.log('beforeEach() complete.');
});

afterEach(async () => {
  await sleep(100);
  console.log('afterEach() complete.');
});

afterAll(async () => {
  await sleep(100);
  console.log('afterAll() complete.');
});

describe('concurrent suite', () => {
  it.concurrent('a', async () => {
    await sleep(100);
    expect(1).toBe(1);
    console.log('concurrent: test a complete.');
  });

  it.concurrent('b', async () => {
    await sleep(100);
    expect(2).toBe(2);
    console.log('concurrent: test b complete.');
  });

  it.concurrent('c', async () => {
    await sleep(100);
    expect(3).toBe(3);
    console.log('concurrent: test c complete.');
  });
});

describe('sequential suite', () => {
  it.sequential('a', async () => {
    await sleep(100);
    expect(1).toBe(1);
    console.log('sequential: test a complete.');
  });

  it.sequential('b', async () => {
    await sleep(100);
    expect(2).toBe(2);
    console.log('sequential: test b complete.');
  });

  it.sequential('c', async () => {
    await sleep(100);
    expect(3).toBe(3);
    console.log('sequential: test c complete.');
  });
});
