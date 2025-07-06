import { Http2ServerRequest } from "http2";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // webpackDevMiddleware: (config: any) => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   };
  //   return config;
  // },
  images: {
    remotePatterns: [
      { hostname: 'http.cat' }
    ]
  }
};

export default nextConfig;
