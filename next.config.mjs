/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Vypne automatickou optimalizaci pro standalone deployment
    remotePatterns: [], // Pro případné externí obrázky v budoucnu
  },
  // Povolení zobrazení obrázků z public/uploads
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
