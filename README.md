# DevTools workshop starter

Try [WebdriverIO DevTools](https://github.com/webdriverio/devtools) on the login page of [the-internet](https://the-internet.herokuapp.com/login). Two of the tests fail on purpose. You run the same tests in two ways:

- **Live mode** opens the DevTools dashboard and fills it in while the tests run.
- **Trace mode** writes one trace zip per test, which you open later in the trace player, the same way you would look at a CI failure.

## You need

- Node.js 22.23.4 or later on 22, 24.22.1 or later on 24, or 26.12.1 or later. Check with `node --version`.
- Google Chrome. WebdriverIO downloads a matching driver for it.
- An internet connection, since the tests run against the-internet.

## Set up

```sh
git clone https://github.com/vishnuv688/devtools-workshop.git
cd devtools-workshop
npm install
```

## Live mode

```sh
npm run demo
```

Chrome opens and runs the tests, and the DevTools dashboard opens in another window. Try:

- **Actions**: every command the test ran. Click one to see the page at that moment.
- **Source**: the test line behind a command.
- **Console**, **Network** and **Errors**: what the browser and the test logged, the requests the page made, and the failures.
- The run button next to a test reruns just that test.
- On a failed test, the bug icon next to the run button reruns it and keeps the failed attempt. The **Compare** tab then shows both attempts side by side.

The only DevTools setup is `services: ['devtools']` in `wdio.conf.ts`.

## Trace mode

```sh
npm run demo:trace
```

No dashboard opens. Each test writes a `trace.zip` under `test-results/`. Open one in the trace player:

```sh
npm run show-trace -- test-results/<folder>/trace.zip
```

Try:

- Step through the actions with the arrow keys, or press Space to play. Press `?` for all shortcuts.
- Drag the playhead along the timeline at the bottom.
- Click a bar on the network track to see the request.
- **A11y**: click an element on the page to get a locator for it.
- **Transcript**: the whole test as text.

The only difference from live mode is `mode: 'trace'` in `wdio.trace.conf.ts`.

To run without a visible Chrome window, which is also much faster, set `HEADLESS=1`:

```sh
HEADLESS=1 npm run demo:trace
```

## The tests

| Spec | What it checks | Result |
|---|---|---|
| `login.e2e.ts` | A valid login reaches the secure area, and an invalid username shows an error | Passes |
| `login-wrong-message.e2e.ts` | A login with a wrong password | Fails |
| `login-renamed-button.e2e.ts` | A login that clicks the submit button by id | Fails |

Use DevTools to find out why each failing test fails.
