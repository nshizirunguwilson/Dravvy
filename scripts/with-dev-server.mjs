#!/usr/bin/env node
/**
 * Runs a command against a dev server, starting one only if needed.
 *
 * The browser sweeps need the app running, but `next build` and `next dev`
 * share the .next directory and corrupt each other if they run at once. So
 * rather than asking for a second terminal, this starts a server, waits for it,
 * runs the command, and shuts the server down again.
 *
 *   node scripts/with-dev-server.mjs npm run proof:styling
 */
import { spawn } from 'node:child_process'

const PORT = process.env.PROOF_PORT ?? '3100'
const URL = `http://localhost:${PORT}/create`
const [, , ...command] = process.argv

if (command.length === 0) {
  console.error('Usage: node scripts/with-dev-server.mjs <command> [args...]')
  process.exit(1)
}

const isUp = async () => {
  try {
    const response = await fetch(URL, { signal: AbortSignal.timeout(2000) })
    return response.ok
  } catch {
    return false
  }
}

const waitForServer = async (deadlineMs = 120_000) => {
  const until = Date.now() + deadlineMs
  while (Date.now() < until) {
    if (await isUp()) return true
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  return false
}

const run = (cmd, args) =>
  new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' })
    child.on('exit', (code) => resolve(code ?? 1))
  })

async function main() {
  let server = null

  if (await isUp()) {
    console.log(`Reusing the dev server already on port ${PORT}.`)
  } else {
    console.log(`Starting a dev server on port ${PORT}...`)
    server = spawn('npm', ['run', 'dev', '--', '-p', PORT], {
      stdio: 'ignore',
      detached: false,
    })
    if (!(await waitForServer())) {
      server.kill('SIGTERM')
      console.error('The dev server never came up.')
      process.exit(1)
    }
    console.log('Dev server ready.')
  }

  const code = await run(command[0], command.slice(1))

  if (server) {
    server.kill('SIGTERM')
    // Give Next a moment to release the port before anything else needs it.
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
  process.exit(code)
}

main().catch((error) => {
  console.error('with-dev-server failed:', error)
  process.exit(1)
})
