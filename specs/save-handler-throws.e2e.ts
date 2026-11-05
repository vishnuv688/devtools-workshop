import { expect } from '@wdio/globals'

async function signIn(password = 'analytical-engine') {
  await browser.url('/login')
  await $('#username').setValue('ada')
  await $('#password').setValue(password)
  await $('#login').click()
}

describe('settings', () => {
  it('saves the display name', async () => {
    await signIn()
    await expect(browser).toHaveUrl(expect.stringContaining('/dashboard'))
    await $('#settings-link').click()
    await $('#display-name').setValue('Ada L.')
    await $('#save').click()
    await expect($('#save-status')).toHaveText('Saved')
  })
})
