import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'browser',
          include: ['test/browser/**/*.test.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        test: {
          name: 'visual-regression',
          include: ['test/visual-regression/**/*.test.ts'],
          browser: {
            enabled: true,
            // Always use the pinned server (npm run vrt:server); never fall back to a local browser.
            provider: playwright({
              connectOptions: {
                wsEndpoint: 'ws://127.0.0.1:6677/',
                exposeNetwork: '<loopback>',
              },
            }),
            headless: true,
            instances: [{ browser: 'chromium', viewport: { width: 640, height: 480 } }],
            expect: {
              toMatchScreenshot: {
                // The browser always runs in the container, so leave process.platform out of the name.
                resolveScreenshotPath: ({ root, testFileDirectory, screenshotDirectory, testFileName, arg, browserName, ext }) =>
                  `${root}/${testFileDirectory}/${screenshotDirectory}/${testFileName}/${arg}-${browserName}${ext}`,
              },
            },
          },
        },
      },
    ],
  },
});
