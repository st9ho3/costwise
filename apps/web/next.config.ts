import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**', // This allows any path from the hostname
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // This allows any path from the hostname
      },
      {
        protocol: 'https',
        hostname: 'yqbnjpxj7oneobhf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**', // Allows all paths under this hostname
      },
    ],
  },
};

export default nextConfig;
