import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export mode
  output: 'export',

  // Base path for GitHub Pages (your repo name)
  basePath: '/portfolio',
  assetPrefix: '/portfolio',

  // Generate trailing slashes so pages map to folder/index.html
  trailingSlash: true,
};

export default nextConfig;
