/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@andresaya/edge-tts"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("ws", "bufferutil", "utf-8-validate");
    }
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
