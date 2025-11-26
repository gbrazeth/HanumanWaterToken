import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: locales,

  // Used when no locale matches
  defaultLocale: 'en-us',

  // Always use locale prefix
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';

  // Detectar se é mobile
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  // Detectar domínio .com.br (mais abrangente)
  const isBrazilianDomain = hostname.includes('.com.br') || 
                           hostname.includes('hanumanwatertoken.com.br') ||
                           hostname === 'hanumanwatertoken.com.br' ||
                           hostname === 'www.hanumanwatertoken.com.br';

  // Detectar idioma português nos headers
  const prefersBrazilian = acceptLanguage.includes('pt-BR') || 
                          acceptLanguage.includes('pt') ||
                          acceptLanguage.includes('pt-br');

  // Log para debug (remover em produção)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware Debug:', {
      hostname,
      pathname,
      isMobile,
      isBrazilianDomain,
      prefersBrazilian,
      userAgent: userAgent.substring(0, 50) + '...'
    });
  }

  // Lógica de redirecionamento para .com.br (prioridade máxima)
  if (isBrazilianDomain) {
    // Se está na raiz, redirecionar para pt-br
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/pt-br';
      return Response.redirect(url, 302);
    }

    // REMOVIDO: Não bloquear acesso a en-us em domínio .com.br
    // Permitir que usuários troquem de idioma livremente

    // Se não tem locale no path, adicionar pt-br
    if (!pathname.startsWith('/pt-br') && !pathname.startsWith('/en-us') && pathname !== '/') {
      const url = request.nextUrl.clone();
      url.pathname = `/pt-br${pathname}`;
      return Response.redirect(url, 302);
    }
  }

  // Lógica especial para mobile: se prefere português e não está em pt-br
  if (isMobile && prefersBrazilian && !pathname.startsWith('/pt-br') && pathname !== '/') {
    // Se está em en-us, redirecionar para pt-br
    if (pathname.startsWith('/en-us')) {
      const url = request.nextUrl.clone();
      url.pathname = pathname.replace('/en-us', '/pt-br');
      return Response.redirect(url, 302);
    }
  }

  // Processar com next-intl middleware
  const response = intlMiddleware(request);
  
  // REMOVIDO: Não interceptar redirecionamentos para en-us
  // Permitir troca livre de idioma em todos os domínios

  return response;
};

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
