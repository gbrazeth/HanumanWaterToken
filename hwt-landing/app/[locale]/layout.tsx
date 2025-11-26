import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Metadata } from 'next';
import { Web3ProviderDynamic } from '@/components/web3/web3-provider-dynamic';
import { Web3Provider } from '@/components/web3/web3-provider';
import { StructuredData } from '@/components/seo/structured-data';
import { ErrorBoundary } from '@/components/error-boundary';
import { LocaleRedirect } from '@/components/locale-redirect';
import { MetaMaskBrowserFix } from '@/components/web3/metamask-browser-fix';
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
    images: [
      {
        url: 'https://hanumanwatertoken.com/images/logos/hwt-logo.png',
        width: 1200,
        height: 630,
        alt: 'Hanuman Water Token Logo',
      },
      {
        url: 'https://hanumanwatertoken.com/favicon.ico?v=5',
        width: 32,
        height: 32,
        alt: 'HWT Favicon',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hanuman Water Token (HWT)',
    description: 'Tokenização de água real com blockchain. Água hipertermal de 9.000 anos.',
    images: ['/images/logos/hwt-logo.png'],
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
  icons: {
    icon: [
      { url: '/favicon.ico?v=5', sizes: 'any' },
      { url: '/favicon.svg?v=5', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=5', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=5', sizes: '16x16', type: 'image/png' }
    ],
    shortcut: '/favicon.ico?v=5',
    apple: [
      { url: '/apple-touch-icon.png?v=5', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg?v=5', color: '#4a6a7d' }
    ]
  },
  manifest: '/manifest.json',
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
        <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
        <link rel="icon" href="/favicon.svg?v=5" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png?v=5" sizes="32x32" type="image/png" />
        <link rel="icon" href="/favicon-16x16.png?v=5" sizes="16x16" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" sizes="180x180" />
        <link rel="shortcut icon" href="/favicon.ico?v=5" />
        <link rel="mask-icon" href="/favicon.svg?v=5" color="#4a6a7d" />
        <StructuredData />
      </head>
      <body suppressHydrationWarning>
        <ConsoleCleaner />
        <ErrorBoundary>
          <Web3ProviderDynamic>
            <NextIntlClientProvider messages={messages}>
              <MetaMaskBrowserFix />
              <LocaleRedirect />
              {children}
            </NextIntlClientProvider>
          </Web3ProviderDynamic>
        </ErrorBoundary>
      </body>
    </html>
  );
}
