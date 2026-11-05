// Engine Works: a small app with bugs you can switch on. Dependency-free.
//
//   npm run app                          # the bugs used in the walkthrough
//   FAULT=none npm run app               # the healthy app
//   FAULT=orders-500,cookie-banner npm run app
//
// FAULT is a comma-separated list of the names in FAULTS below.

import http from 'node:http'

const PORT = Number(process.env.PORT ?? 4567)
const FAULT = process.env.FAULT ?? 'orders-500,save-handler-throws'

const FAULTS = new Set([
  'none',
  'selector-renamed',
  'slow-render',
  'cookie-banner',
  'orders-500',
  'orders-shape-changed',
  'save-handler-throws',
  'dashboard-script-404',
  'profile-401',
  'orders-slow'
])
const ON = new Set(FAULT.split(',').map((name) => name.trim()).filter(Boolean))
const unknown = [...ON].filter((name) => !FAULTS.has(name))
if (unknown.length > 0) {
  console.error(`unknown FAULT "${unknown.join(', ')}"; one of: ${[...FAULTS].join(', ')}`)
  process.exit(2)
}

const USER = { username: 'ada', password: 'analytical-engine' }
const ORDERS = [
  { id: 'A-1001', item: 'Brass gear set', qty: 2 },
  { id: 'A-1002', item: 'Punched card deck', qty: 1 },
  { id: 'A-1003', item: 'Difference table', qty: 4 }
]

const layout = (title, body, scripts = []) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title} | Engine Works</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 0; background: #f6f6f4; }
  header { background: #233; color: #fff; padding: 12px 24px; }
  header a { color: #cde; margin-right: 16px; }
  main { max-width: 640px; margin: 24px auto; background: #fff; padding: 24px; border-radius: 8px; }
  label { display: block; margin: 12px 0 4px; }
  input[type=text], input[type=password] { width: 100%; padding: 8px; box-sizing: border-box; }
  button { margin-top: 16px; padding: 8px 16px; }
  .error { color: #b00; }
  #cookie-banner { position: fixed; left: 0; right: 0; bottom: 0; top: 0; background: rgba(0,0,0,.55);
    display: flex; align-items: flex-end; justify-content: center; }
  #cookie-banner div { background: #fff; padding: 16px 24px; margin-bottom: 24px; border-radius: 8px; }
</style>
</head>
<body>
<header><strong>Engine Works</strong> <a id="dashboard-link" href="/dashboard">Dashboard</a><a id="settings-link" href="/settings">Settings</a></header>
<main>${body}</main>
${scripts.map((src) => `<script src="${src}"></script>`).join('\n')}
</body>
</html>`

const loginButtonId = ON.has('selector-renamed') ? 'sign-in' : 'login'

const pages = {
  '/login': () =>
    layout(
      'Sign in',
      `<h1>Sign in</h1>
<form id="login-form">
  <label for="username">Username</label><input id="username" type="text" autocomplete="off">
  <label for="password">Password</label><input id="password" type="password" autocomplete="off">
  <button id="${loginButtonId}" type="submit">Sign in</button>
  <p id="login-error" class="error" hidden></p>
</form>`,
      ['/static/login.js']
    ),
  '/dashboard': () =>
    layout(
      'Dashboard',
      `<h1 id="welcome">Loading...</h1>
<p id="order-count">Loading...</p>
<ul id="orders"></ul>
<button id="refresh" type="button">Refresh</button>`,
      [
        ON.has('dashboard-script-404')
          ? '/static/dashboard.v2.js'
          : '/static/dashboard.js'
      ]
    ),
  '/settings': () =>
    layout(
      'Settings',
      `<h1>Settings</h1>
<form id="settings-form">
  <label for="display-name">Display name</label><input id="display-name" type="text" value="Ada">
  <label><input id="newsletter" type="checkbox"> Send me the newsletter</label>
  <button id="save" type="submit">Save</button>
  <p id="save-status"></p>
</form>
${
  ON.has('cookie-banner')
    ? '<div id="cookie-banner"><div>We use cookies. <button id="accept-cookies" type="button">Accept</button></div></div>'
    : ''
}`,
      ['/static/settings.js']
    )
}

const scripts = {
  '/static/login.js': `
document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value
    })
  })
  if (res.ok) {
    location.href = '/dashboard'
    return
  }
  const error = document.getElementById('login-error')
  error.textContent = 'Sign in failed'
  error.hidden = false
})`,
  '/static/dashboard.js': `
async function loadProfile() {
  const res = await fetch('/api/profile')
  if (res.status === 401) {
    location.href = '/login'
    return
  }
  const profile = await res.json()
  document.getElementById('welcome').textContent = 'Welcome, ' + profile.name
}
async function loadOrders() {
  let orders = []
  try {
    const res = await fetch('/api/orders')
    if (res.ok) {
      const data = await res.json()
      orders = data.orders || []
    }
  } catch (err) {
    orders = []
  }
  const render = () => {
    const list = document.getElementById('orders')
    list.replaceChildren()
    for (const order of orders) {
      const li = document.createElement('li')
      li.className = 'order'
      li.textContent = order.id + ' ' + order.item + ' x' + order.qty
      list.appendChild(li)
    }
    document.getElementById('order-count').textContent = orders.length + ' orders'
  }
  ${ON.has('slow-render') ? 'setTimeout(render, 2500)' : 'render()'}
}
document.getElementById('refresh').addEventListener('click', loadOrders)
loadProfile()
loadOrders()`,
  '/static/settings.js': `
document.getElementById('settings-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  const form = { displayName: document.getElementById('display-name').value }
  ${
    ON.has('save-handler-throws')
      ? "const payload = { name: form.display_name.trim(), newsletter: document.getElementById('newsletter').checked }"
      : "const payload = { name: form.displayName.trim(), newsletter: document.getElementById('newsletter').checked }"
  }
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  })
  document.getElementById('save-status').textContent = res.ok ? 'Saved' : 'Not saved'
})
const accept = document.getElementById('accept-cookies')
if (accept) {
  accept.addEventListener('click', () => document.getElementById('cookie-banner').remove())
}`
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function send(res, status, type, body) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(body)
}

const json = (res, status, value) =>
  send(res, status, 'application/json', JSON.stringify(value))

async function readBody(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
  }
  try {
    return JSON.parse(raw || '{}')
  } catch {
    return {}
  }
}

async function api(req, res, path) {
  if (path === '/api/login' && req.method === 'POST') {
    const body = await readBody(req)
    const ok =
      body.username === USER.username && body.password === USER.password
    return ok
      ? json(res, 200, { token: 'session-token' })
      : json(res, 401, { error: 'invalid_credentials' })
  }
  if (path === '/api/profile') {
    return ON.has('profile-401')
      ? json(res, 401, { error: 'session_expired' })
      : json(res, 200, { name: 'Ada', email: 'ada@example.test' })
  }
  if (path === '/api/orders') {
    if (ON.has('orders-500')) {
      return json(res, 500, { error: 'orders_db_unavailable' })
    }
    if (ON.has('orders-shape-changed')) {
      return json(res, 200, { items: ORDERS, total: ORDERS.length })
    }
    if (ON.has('orders-slow')) {
      await sleep(12000)
    }
    return json(res, 200, { orders: ORDERS })
  }
  if (path === '/api/settings' && req.method === 'POST') {
    await readBody(req)
    return json(res, 200, { saved: true })
  }
  return json(res, 404, { error: 'not_found' })
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname
  if (path === '/' || path === '/index.html') {
    res.writeHead(302, { location: '/login' })
    return res.end()
  }
  if (path === '/__fault') {
    return json(res, 200, { fault: FAULT })
  }
  if (path.startsWith('/api/')) {
    return api(req, res, path)
  }
  if (scripts[path]) {
    return send(res, 200, 'text/javascript', scripts[path])
  }
  if (pages[path]) {
    return send(res, 200, 'text/html; charset=utf-8', pages[path]())
  }
  return send(res, 404, 'text/plain', 'not found')
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Engine Works on http://localhost:${PORT} (bugs: ${FAULT})`)
})
