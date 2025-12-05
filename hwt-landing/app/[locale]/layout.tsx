import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Metadata } from 'next';
import { Web3ProviderDynamic } from '@/components/web3/web3-provider-dynamic';
import { StructuredData } from '@/components/seo/structured-data';
import { ErrorBoundary } from '@/components/error-boundary';
import { ConsoleCleaner } from '@/components/console-cleaner';
import '@/lib/polyfills';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Hanuman Water Token (HWT) - Tokenização de Água Real',
  description: 'Hanuman Water Token (HWT) - Plataforma de tokenização de água real com blockchain. Água hipertermal de 9.000 anos, 100% natural. Invista no futuro da água.',
  keywords: 'Hanuman Water Token, HWT, tokenização, água, blockchain, criptomoeda, investimento, água natural, hipertermal',
  authors: [{ name: 'Hanuman Water Token Team' }],
  creator: 'Hanuman Water Token',
  publisher: 'Hanuman Water Token',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hanumanwatertoken.com'),
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'Hanuman Water Token (HWT) - Tokenização de Água Real',
    description: 'Plataforma de tokenização de água real com blockchain. Água hipertermal de 9.000 anos, 100% natural.',
    url: 'https://hanumanwatertoken.com',
    siteName: 'Hanuman Water Token',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanuman Water Token (HWT)',
    description: 'Tokenização de água real com blockchain. Água hipertermal de 9.000 anos.',
    creator: '@HanumanWaterToken',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <StructuredData />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Interceptação AGRESSIVA e CONTÍNUA de console
            (function() {
              var filters = [
                // Erros de extensões Chrome
                'origins don\\'t match', 'pocket universe', 'backpack couldn\\'t override', 'injected.js', 'contentscript.js', 'secure.walletconnect.org', 'uncaught error: minified react error',
                // Erros de Permissions Policy (até headers serem aplicados)
                'permissions policy violation', 'clipboard-read is not allowed', 'clipboard-write is not allowed',
                // Erros de recursos bloqueados pelo Brave
                'err_blocked_by_client', 'beacon.min.js',
                // Erros de preload
                'was preloaded using link preload but not used',
                // Web3Modal informativos
                'web3modal', 'initialized successfully', 'initialization attempt'
              ];
              var originalError = console.error;
              var originalWarn = console.warn;
              var originalLog = console.log;
              
              function createFilteredFunction(original) {
                return function() {
                  var msg = arguments[0] ? String(arguments[0]).toLowerCase() : '';
                  if (filters.some(function(f) { return msg.indexOf(f) !== -1; })) {
                    // Silenciar completamente
                    return;
                  }
                  return original.apply(console, arguments);
                };
              }
              
              function applyInterception() {
                console.error = createFilteredFunction(originalError);
                console.warn = createFilteredFunction(originalWarn);
                console.log = function() {
                  var msg = arguments[0] ? String(arguments[0]).toLowerCase() : '';
                  if (filters.some(function(f) { return msg.indexOf(f) !== -1; })) return;
                  return originalLog.apply(console, arguments);
                };
              }
              
              // Aplicar imediatamente
              applyInterception();
              
              // Reaplicar a cada 100ms para combater extensões que redefinam o console
              setInterval(applyInterception, 100);
              
              // Interceptar também window.onerror
              window.addEventListener('error', function(e) {
                var msg = e.message ? e.message.toLowerCase() : '';
                if (filters.some(function(f) { return msg.indexOf(f) !== -1; })) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              }, true);
              
              // Interceptar unhandledrejection
              window.addEventListener('unhandledrejection', function(e) {
                var msg = e.reason ? String(e.reason).toLowerCase() : '';
                if (filters.some(function(f) { return msg.indexOf(f) !== -1; })) {
                  e.preventDefault();
                  return false;
                }
              }, true);
              
            })();
          `
        }} />
      </head>
      <body suppressHydrationWarning>
        <ConsoleCleaner />
        <ErrorBoundary>
          <Web3ProviderDynamic>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </Web3ProviderDynamic>
        </ErrorBoundary>
      </body>
    </html>
  );
}
