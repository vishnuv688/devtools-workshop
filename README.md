# DevTools workshop starter

Try [WebdriverIO DevTools](https://github.com/webdriverio/devtools) on a small app called Engine Works. The app has bugs switched on deliberately, so some tests fail. You run the same tests in two ways:

- **Live mode** opens the DevTools dashboard and fills it in while the tests run.
- **Trace mode** writes one trace zip per test, which you open later in the trace player, the same way you would look at a CI failure.

## You need

- Node.js 22.23.4 or later on 22, 24.22.1 or later on 24, or 26.12.1 or later. Check with `node --version`.
- Google Chrome. WebdriverIO downloads a matching driver for it.

## Set up

```sh
git clone <this repo>
cd devtools-workshop
npm install
```

## Run it

Each command starts the app, runs the tests and stops the app again.

### Live mode

```sh
npm run demo
```

Chrome opens and runs the tests, and the DevTools dashboard opens in another window. Try:

- **Actions**: every command the test ran. Click one to see the page at that moment.
- **Source**: the test line behind a command.
- **Console**, **Network** and **Errors**: what the browser logged and requested.
- The run button next to a test reruns just that test.
- On a failed test, the bug icon next to the run button reruns it and keeps the failed attempt. The **Compare** tab then shows both attempts side by side.

### Trace mode

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

## The tests

| Spec | What it checks |
|---|---|
| `login.e2e.ts` | Signing in lands on the dashboard |
| `wrong-expected-text.e2e.ts` | The dashboard greets the user |
| `orders-500.e2e.ts` | The dashboard lists the user's orders |
| `save-handler-throws.e2e.ts` | Settings saves a new display name |

Only the login test passes. Use DevTools to find out why each of the others fails.

## Changing the bugs

The app reads a comma-separated list of bugs from `FAULT`:

```sh
FAULT=none npm run demo:trace                         # no bugs
FAULT=cookie-banner,orders-slow npm run demo:trace    # a different set
```

The full list is at the top of `app/server.mjs`. To click around the app yourself, run `npm run app` and open http://localhost:4567. Sign in as `ada` with the password `analytical-engine`. While it is running, the demo commands use it instead of starting their own.
