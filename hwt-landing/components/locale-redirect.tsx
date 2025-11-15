'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function LocaleRedirect() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Só executar no cliente
    if (typeof window === 'undefined') return

    const hostname = window.location.hostname
    const isBrazilianDomain = hostname.includes('.com.br') || 
                             hostname === 'hanumanwatertoken.com.br' ||
                             hostname === 'www.hanumanwatertoken.com.br'

    // Se está em domínio .com.br mas na versão en-us, redirecionar
    if (isBrazilianDomain && pathname.startsWith('/en-us')) {
      const newPath = pathname.replace('/en-us', '/pt-br')
      router.replace(newPath)
      return
    }

    // Se está em domínio .com.br na raiz, redirecionar para pt-br
    if (isBrazilianDomain && pathname === '/') {
      router.replace('/pt-br')
      return
    }

    // Detectar idioma do navegador como fallback
    const browserLanguage = navigator.language || navigator.languages?.[0] || ''
    const prefersBrazilian = browserLanguage.includes('pt-BR') || 
                            browserLanguage.includes('pt') ||
                            browserLanguage.includes('pt-br')

    // Se prefere português mas está em en-us, sugerir mudança (apenas em domínios .com.br)
    if (isBrazilianDomain && prefersBrazilian && pathname.startsWith('/en-us')) {
      const newPath = pathname.replace('/en-us', '/pt-br')
      router.replace(newPath)
    }
  }, [pathname, router])

  return null
}
