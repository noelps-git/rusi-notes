import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Rusi Notes - Your Personal Food Journal';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #e52020 0%, #c41a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Logo Circle */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <span style={{ fontSize: 80 }}>🍽️</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          Rusi Notes
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          Your Personal Food Journal
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 20,
          }}
        >
          Track • Rate • Share • Discover
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
