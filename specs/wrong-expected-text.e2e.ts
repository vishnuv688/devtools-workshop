import { expect } from '@wdio/globals'

async function signIn(password = 'analytical-engine') {
  await browser.url('/login')
  await $('#username').setValue('ada')
  await $('#password').setValue(password)
  await $('#login').click()
}

describe('dashboard', () => {
  it('greets the signed-in user', async () => {
    await signIn()
    await expect(browser).toHaveUrl(expect.stringContaining('/dashboard'))
    await expect($('#welcome')).toHaveText('Welcome, Ada Lovelace')
  })
})
