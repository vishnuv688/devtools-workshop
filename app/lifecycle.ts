import { spawn, type ChildProcess } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export const APP_URL = 'http://127.0.0.1:4567'

const SERVER = fileURLToPath(new URL('./server.mjs', import.meta.url))

let app: ChildProcess | undefined

async function isUp() {
  try {
    return (await fetch(`${APP_URL}/__fault`)).ok
  } catch {
    return false
  }
}

// Reuses an app that is already running, so `npm run app` with a custom FAULT and dashboard reruns both work.
export async function startApp() {
  if (await isUp()) return
  app = spawn(process.execPath, [SERVER], { stdio: 'inherit', env: process.env })
  for (let attempt = 0; attempt < 50; attempt++) {
    if (await isUp()) return
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error(`Engine Works did not start on ${APP_URL}`)
}

export function stopApp() {
  app?.kill()
  app = undefined
}
