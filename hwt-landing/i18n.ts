import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['pt-br', 'en-us'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // Ensure that the incoming locale is valid
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as any)) {
    locale = 'pt-br';
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
