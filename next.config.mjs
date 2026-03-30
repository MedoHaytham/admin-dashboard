/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dummyjson.com' },
      { protocol: 'https', hostname: 'cdn.dummyjson.com' },
      { protocol: 'https', hostname: 'e-commerce-backend-geri.onrender.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
