import { expect } from '@wdio/globals'

// Fails on purpose: the test looks for a login button id the page does not have.
describe('Login after a page change', () => {
  it('clicks the login button by its old id', async () => {
    console.log('[TEST] clicking the login button by id')
    await browser.url('/login')
    await $('#username').setValue('tomsmith')
    await $('#password').setValue('SuperSecretPassword!')
    await $('#login-button').click()
    await expect($('#flash')).toHaveText(expect.stringContaining('You logged into a secure area!'))
  })
})
