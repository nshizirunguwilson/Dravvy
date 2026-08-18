/**
 * Dravvy service worker.
 *
 * The app is entirely client side: the draft lives in localStorage and the PDF
 * and DOCX are generated in the browser. So once the shell and its assets are
 * cached there is genuinely nothing left to fetch, and the whole builder works
 * with no network at all.
 *
 * Strategy
 *   navigations   network first, fall back to the cached shell when offline
 *   static assets cache first, they are content hashed so they never go stale
 *   everything else  network, with a cache fallback
 *
 * CACHE_VERSION must change whenever the shell changes, which the build does
 * by writing a fresh value into this file at deploy time if you wire it up.
 * Until then, bump it by hand when you change the shell.
 */
const CACHE_VERSION = 'dravvy-v1'
const SHELL = ['/', '/create', '/settings', '/offline', '/manifest.webmanifest', '/icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // Individual failures must not abort the install, so each is caught.
      .then((cache) => Promise.all(SHELL.map((url) => cache.add(url).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const isStaticAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/fonts/') ||
  /\.(css|js|woff2?|ttf|otf|svg|png|jpg|jpeg|webp|ico)$/.test(url.pathname)

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigations: try the network so a deploy is picked up, fall back to cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
          return response
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION)
          return (
            (await cache.match(request)) ||
            (await cache.match('/create')) ||
            (await cache.match('/')) ||
            (await cache.match('/offline')) ||
            Response.error()
          )
        }),
    )
    return
  }

  // Static assets are content hashed, so a cache hit is always correct.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy))
            return response
          }),
      ),
    )
    return
  }

  event.respondWith(fetch(request).catch(() => caches.match(request).then((hit) => hit || Response.error())))
})
