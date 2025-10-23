import type { NextConfig } from "next";

// Conditionally import bundle analyzer only in development
let bundleAnalyzer = (config: NextConfig) => config;
if (process.env.ANALYZE === "true") {
  try {
    const withBundleAnalyzer = require("@next/bundle-analyzer");
    bundleAnalyzer = withBundleAnalyzer({
      enabled: true,
    });
  } catch (e) {
    console.warn("Bundle analyzer not available in production build");
  }
}

// Temporarily disable PWA for build testing
const pwa = (config: NextConfig) => config;

const nextConfig: NextConfig = {
  // Enable standalone output for optimized production builds
  output: 'standalone',
  
  // Set the correct workspace root to avoid lockfile warnings
  outputFileTracingRoot: require('path').join(__dirname),

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Optimize images with advanced settings
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1200, 1920], // Reduced from 6 to 4 sizes
    imageSizes: [16, 32, 48, 64, 96, 128], // Reduced from 8 to 6 sizes
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kroiautocenter.fi',
        port: '',
        pathname: '/cars/**',
      },
      {
        protocol: 'https',
        hostname: '*.render.com',
        port: '',
        pathname: '/**',
      }
    ],
    loader: 'default',
    unoptimized: false,
  },

  // Compiler optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
    // Optimize styled-components
    styledComponents: true,
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,

  // Skip static generation for problematic pages during deployment
  generateBuildId: async () => {
    return "kroi-auto-build-" + Date.now();
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
    ],
    // Reduce memory usage during build
    webpackBuildWorker: true,
  },

  // Disable problematic features during build
  trailingSlash: false,
  generateEtags: false,

  // Headers for caching and security
  async headers() {
    return [
      // Security headers for all routes
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.sanity.io",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob: https://cdn.sanity.io",
              "connect-src 'self' https://www.google-analytics.com https://vitals.vercel-insights.com https://*.sentry.io https://infragrid.v.network https://*.sanity.io https://cdn.sanity.io",
              "frame-src 'self' https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      // Cache headers for static assets
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(pwa(nextConfig));
