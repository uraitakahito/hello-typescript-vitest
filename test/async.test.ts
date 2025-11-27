// Reference:
// https://qiita.com/mori_goq/items/5b01666cff5134f821bd

// Asynchronous function that resolves successfully
export const fetchDataResolve = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('tarosuke');
  }, 10);
});

// Asynchronous function that rejects with an error
export const fetchDataReject = () => new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error('something bad happened'));
  }, 10);
});

describe('verify asynchronous success', () => {
  it('test 1', () => fetchDataResolve().then((data) => {
    expect(data).toBe('tarosuke');
  }));

  it('test 2', () => expect(fetchDataResolve()).resolves.toBe('tarosuke'));

  it('test 3', async () => {
    await expect(fetchDataResolve()).resolves.toBe('tarosuke');
  });

  it('test 4', async () => {
    await expect(fetchDataResolve()).resolves.toBe('tarosuke');
  });
});

describe('verify asynchronous failure', () => {
  it('test 1', () => fetchDataReject().catch((data) => {
    expect(data.message).toBe('something bad happened');
  }));

  it('test 2', () => expect(fetchDataReject()).rejects.toThrow('something bad happened'));

  it('test 3', async () => {
    await expect(fetchDataReject()).rejects.toThrow('something bad happened');
  });

  it('test 4', async () => {
    //
    // Ensure that the assertion is called once
    // (If the asynchronous function succeeds, the catch block will not be executed and the test will be considered successful, so it is recommended to include this)
    //
    expect.assertions(1);

    try {
      await fetchDataReject();
    }
    catch (error: any) {
      expect(error.message).toBe('something bad happened');
    }
  });
});
