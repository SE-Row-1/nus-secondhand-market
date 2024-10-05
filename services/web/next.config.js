/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
};

export default config;
