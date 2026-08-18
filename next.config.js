/** @type {import('next').NextConfig} */

/**
 * Security headers.
 *
 * The app is entirely client side and talks to no third party, so the policy
 * can be tight. 'unsafe-inline' is required for styles because Next injects
 * them, and for the one inline script in <head> that paints the stored theme
 * before first paint.
 */
const isDev = process.env.NODE_ENV !== 'production'

// Next's dev server compiles with eval, so blocking it stops React hydrating
// and the whole app goes dead on click. Production needs no eval at all.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'"

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // The worker must never be cached, or a deploy cannot replace it.
      {
        source: '/sw.js',
        headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
      },
    ]
  },
}

module.exports = nextConfig
