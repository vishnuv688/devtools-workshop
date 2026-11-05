import { expect } from '@wdio/globals'

// Fails on purpose: the test expects a success message after a wrong password.
describe('Login with a wrong password', () => {
  it('expects to reach the secure area', async () => {
    console.log('[TEST] logging in with a wrong password')
    await browser.url('/login')
    await $('#username').setValue('tomsmith')
    await $('#password').setValue('wrong-password')
    await $('button[type="submit"]').click()
    await expect($('#flash')).toHaveText(expect.stringContaining('You logged into a secure area!'))
  })
})
