// @ts-check
/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  experimental: {
    serverActions: true,
    typedRoutes: true,
  },
  output: "standalone",
};

module.exports = nextConfig;
