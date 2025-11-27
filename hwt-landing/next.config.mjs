import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers unificados para resolver problemas de segurança, CORS e Login Social
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Permissions-Policy',
            value: 'clipboard-read=(self), clipboard-write=(self), camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https: wss: https://*.walletconnect.com https://*.walletconnect.org https://*.google.com; frame-src 'self' https: https://*.walletconnect.com https://*.walletconnect.org https://accounts.google.com https://*.google.com; object-src 'none'; base-uri 'self';"
          }
        ]
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config, { isServer }) => {
    // Polyfill para indexedDB no servidor
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'fake-indexeddb': false,
      };
    }

    // Resolver problemas com módulos opcionais do pino e WalletConnect
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
      'lokijs': false,
      'encoding': false,
      'fs': false,
      'net': false,
      'tls': false,
      '@react-native-async-storage/async-storage': false,
    };
    
    // Ignorar módulos opcionais que causam problemas no build
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push(
        'pino-pretty', 
        'lokijs', 
        'encoding',
        '@react-native-async-storage/async-storage'
      );
    }
    
    // Configurar aliases para módulos problemáticos
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    };

    // Suprimir warnings específicos do MetaMask SDK
    config.ignoreWarnings = [
      { module: /node_modules\/@metamask\/sdk/ },
      { message: /Can't resolve '@react-native-async-storage\/async-storage'/ },
    ];
    
    return config;
  },
  // Disable static generation for legal pages during development
  ...(process.env.NODE_ENV === 'development' && {
    generateBuildId: async () => {
      return 'development-' + Date.now()
    }
  }),
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default withNextIntl(nextConfig);
