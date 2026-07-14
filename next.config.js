const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      // Kalbar
      {
        source: "/:path*",
        has: [{ type: "host", value: "kalbarberwakaf.id" }],
        destination: "/berwakaf/kalbar/:path*",
      },
      // POJOK KOPI
      {
        source: "/:path*",
        has: [{ type: "host", value: "ngopi.satuwakaf.id" }],
        destination: "/ngopi/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "wakafeinisef.satuwakaf.id" }],
        destination: "/ngopi/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "isef.satuwakaf.id" }],
        destination: "/ngopi/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "wakafein.id" }],
        destination: "/ngopi/:path*",
      },
      // IKHTIAR
      {
        source: "/:path*",
        has: [{ type: "host", value: "ikhtiar.satuwakaf.id" }],
        destination: "/ikhtiar/:path*",
      },
      // MURABI
      {
        source: "/:path*",
        has: [{ type: "host", value: "murobbi.satuwakaf.id" }],
        destination: "/murabbi/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "murabbi.satuwakaf.id" }],
        destination: "/murabbi/:path*",
      },
      // Horas Wakf Sumut Berkah
      {
        source: "/:path*",
        has: [{ type: "host", value: "horas.satuwakaf.id" }],
        destination: "/horas/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "program.wakafsumutberkah.id" }],
        destination: "/horas/:path*",
      },
      // Wakaf Sumut Berkah
      {
        source: "/:path*",
        has: [{ type: "host", value: "sumutberwakaf.satuwakaf.id" }],
        destination: "/berwakaf/sumut/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "wakafsumutberkah.id" }],
        destination: "/berwakaf/sumut/:path*",
      },
      // Wakaf Jatim
      {
        source: "/:path*",
        has: [{ type: "host", value: "wakafjatim.id" }],
        destination: "/berwakaf/jatim/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "wakafjatim.satuwakaf.id" }],
        destination: "/berwakaf/jatim/:path*",
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "test.satuwakaf.id" }],
        destination: "/test/:path*",
      },
      // WAKAFEIN FESYAR
      {
        source: "/:path*",
        has: [{ type: "host", value: "wakafeinfesyar.satuwakaf.id" }],
        destination: "/fesyar/epos/:path*",
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
