import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "s2.loli.net",
      },
      {
        hostname: "nshm-public.s3.ap-southeast-1.amazonaws.com",
      },
    ],
  },
};

export default config;
