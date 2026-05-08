import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Dravvy — Resume builder, no account needed'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F8FAFC',
          color: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          padding: 80,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: '#2563EB',
              color: '#FFFFFF',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '-0.04em',
            }}
          >
            D
          </div>
          <div style={{ fontSize: 30, letterSpacing: '-0.02em', fontWeight: 700 }}>Dravvy</div>
        </div>

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
              fontSize: 96,
              lineHeight: 1.04,
              letterSpacing: '-0.035em',
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            {'Build a resume you’ll'}
            <br />
            actually want to send.
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#475569',
              maxWidth: 800,
              letterSpacing: '-0.005em',
              fontWeight: 500,
            }}
          >
            Nine guided sections. Live A4 preview. PDF or DOCX, no account.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
