/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Vypne automatickou optimalizaci pro standalone deployment
    remotePatterns: [], // Pro případné externí obrázky v budoucnu
  },
};

export default nextConfig;
