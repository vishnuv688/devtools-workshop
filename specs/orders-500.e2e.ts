import { strict as assert } from 'node:assert'
import { expect } from '@wdio/globals'

async function signIn(password = 'analytical-engine') {
  await browser.url('/login')
  await $('#username').setValue('ada')
  await $('#password').setValue(password)
  await $('#login').click()
}

describe('dashboard', () => {
  it('lists the user orders', async () => {
    await signIn()
    await expect($('#order-count')).not.toHaveText('Loading...')
    const rows = await $$('#orders li').length
    assert.equal(rows, 3)
  })
})
