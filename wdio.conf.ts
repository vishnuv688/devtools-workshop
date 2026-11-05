// Live mode: the DevTools dashboard opens and fills in while the tests run.

import { APP_URL, startApp, stopApp } from './app/lifecycle.ts'

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./specs/**/*.e2e.ts'],
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--window-size=1280,900',
          // Stops Chrome's password-leak check from blocking input after a login form is submitted.
          '--host-resolver-rules=MAP passwordsleakcheck-pa.googleapis.com 127.0.0.1'
        ]
      }
    }
  ],
  logLevel: 'warn',
  baseUrl: APP_URL,
  waitforTimeout: 5000,
  services: ['devtools'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 60000 },
  onPrepare: startApp,
  onComplete: stopApp
}
