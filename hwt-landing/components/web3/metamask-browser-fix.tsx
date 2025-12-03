'use client'

import { useEffect, useState } from 'react'

// Este componente agora é simplificado pois o AppKit lida melhor com MetaMask browser
export function MetaMaskBrowserFix() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMetaMaskBrowser = () => {
      const isMetaMask = /MetaMask/i.test(navigator.userAgent) && window.ethereum?.isMetaMask
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)

      if (isMetaMask && isMobile) {
        setIsMetaMaskBrowser(true)
        console.log('[MetaMaskBrowserFix] MetaMask browser detected')
        
        // AppKit lida automaticamente, apenas mostrar loading breve
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      } else {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(checkMetaMaskBrowser, 100)
    return () => clearTimeout(timer)
  }, [])

  // Se estamos no MetaMask browser e ainda carregando, mostrar loading
  if (isMetaMaskBrowser && isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-green-800 mb-2">🎉 MetaMask Detectado!</h2>
          <p className="text-green-600">Inicializando sua carteira...</p>
        </div>
      </div>
    )
  }

  return null
}
