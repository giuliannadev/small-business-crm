/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/small-business-crm' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/small-business-crm' : '',
  trailingSlash: true,
  output: 'export',
}

export default nextConfig
