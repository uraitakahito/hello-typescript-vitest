const redirectFromExample = () => {
  const { hostname, search } = window.location;
  const redirectHostname = hostname === 'example.com' ? 'www.google.com' : hostname;
  window.location.href = `//${redirectHostname}${search}`;
};

const setupWindow = () => {
  global.window = Object.create(null);
  Object.defineProperty(window, 'location', {
    value: {
      hostname: '',
      href: '',
      pathname: '/',
      search: '',
    },
    writable: true,
  });
};

describe('redirectFromExample', () => {
  it('redirect to google.com from example', () => {
    expect.assertions(1);

    setupWindow();

    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'example.com',
        href: 'https://example.com/',
        pathname: '/',
        search: '',
      },
    });

    redirectFromExample();

    expect(window.location.href).toBe('//www.google.com');
  });

  it('not redirect to google.com', () => {
    expect.assertions(1);

    setupWindow();

    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'www.yahoo.jp',
        href: 'https://www.yahoo.jp/',
        pathname: '/',
        search: '?hoge=text',
      },
    });

    redirectFromExample();

    expect(window.location.href).toBe('//www.yahoo.jp?hoge=text');
  });
});
