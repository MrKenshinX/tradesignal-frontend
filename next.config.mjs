/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Catatan: rewrites & headers tidak berjalan pada static export ('output: export').
  // API diarahkan via NEXT_PUBLIC_API_URL ke domain backend. Header via Cloudflare _headers.
};

export default nextConfig;
