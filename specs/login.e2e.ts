import { expect } from '@wdio/globals'

describe('Login', () => {
  it('logs into the secure area with valid credentials', async () => {
    console.log('[TEST] logging in with valid credentials')
    await browser.url('/login')
    await $('#username').setValue('tomsmith')
    await $('#password').setValue('SuperSecretPassword!')
    await $('button[type="submit"]').click()
    await expect($('#flash')).toHaveText(expect.stringContaining('You logged into a secure area!'))
  })

  it('shows an error for an invalid username', async () => {
    console.log('[TEST] logging in with an invalid username')
    await browser.url('/login')
    await $('#username').setValue('foobar')
    await $('#password').setValue('barfoo')
    await $('button[type="submit"]').click()
    await expect($('#flash')).toHaveText(expect.stringContaining('Your username is invalid!'))
  })
})
