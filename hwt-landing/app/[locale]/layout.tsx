import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import type { Metadata } from 'next';
import { Web3Provider } from '@/components/web3/web3-provider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Hanuman Water Token (HWT)',
  description: 'Hanuman Water Token - Presale Platform',
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
      <body suppressHydrationWarning>
        <Web3Provider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
