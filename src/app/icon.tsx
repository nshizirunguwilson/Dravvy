import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: '#16140F',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FAF6EE',
          fontFamily: 'Georgia, serif',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          borderRadius: 14,
        }}
      >
        D
      </div>
    ),
    size,
  )
}
