import { expect } from '@wdio/globals'

describe('login', () => {
  it('signs in and lands on the dashboard', async () => {
    await browser.url('/login')
    await $('#username').setValue('ada')
    await $('#password').setValue('analytical-engine')
    await $('#login').click()
    await expect(browser).toHaveUrl(expect.stringContaining('/dashboard'))
  })
})
