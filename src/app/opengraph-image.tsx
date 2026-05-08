import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Dravvy — A resume, set in print.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F7F2E9',
          color: '#16140F',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Top bar: mark + plate */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: '#16140F',
                color: '#F7F2E9',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              D
            </div>
            <div style={{ fontSize: 28, letterSpacing: '-0.02em', fontWeight: 500 }}>Dravvy</div>
          </div>
          <div
            style={{
              fontSize: 14,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#5A554C',
              fontFamily: 'monospace',
            }}
          >
            Resume Builder · A4
          </div>
        </div>

        {/* Hairline rule under top bar */}
        <div style={{ height: 1, background: '#1614001A', marginTop: 36 }} />

        {/* Display headline */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <div
            style={{
              fontSize: 110,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              fontWeight: 500,
              maxWidth: 1000,
            }}
          >
            A resume,
            <br />
            <span style={{ fontStyle: 'italic' }}>set in print.</span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#3D382F',
              fontFamily: 'sans-serif',
              maxWidth: 720,
              letterSpacing: '-0.005em',
            }}
          >
            Nine guided sections. A true A4 preview. PDF or DOCX, no account.
          </div>
        </div>

        {/* Bottom rule */}
        <div style={{ height: 1, background: '#1614001A', marginTop: 50 }} />
      </div>
    ),
    size,
  )
}
