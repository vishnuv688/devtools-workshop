// Trace mode: no dashboard; each test writes a trace zip under test-results/.
// Open one with: npm run show-trace -- <path-to-trace.zip>

import { config as live } from './wdio.conf.ts'

export const config: WebdriverIO.Config = {
  ...live,
  services: [
    [
      'devtools',
      {
        mode: 'trace',
        traceGranularity: 'test',
        tracePolicy: 'on'
      }
    ]
  ]
}
