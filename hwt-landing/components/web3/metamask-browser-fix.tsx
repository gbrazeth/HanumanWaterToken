'use client'

import { useEffect, useState } from 'react'
import { forceReinitWeb3Modal } from '@/lib/web3modal-singleton'

export function MetaMaskBrowserFix() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMetaMaskBrowser, setIsMetaMaskBrowser] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkMetaMaskBrowser = () => {
      const isMetaMask = /MetaMask/i.test(navigator.userAgent) && window.ethereum?.isMetaMask
      const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
      
      console.log('[MetaMaskBrowserFix] Environment check:', {
        userAgent: navigator.userAgent,
        hasEthereum: !!window.ethereum,
        isMetaMask: window.ethereum?.isMetaMask,
        isMobile,
        detected: isMetaMask && isMobile
      })

      if (isMetaMask && isMobile) {
        setIsMetaMaskBrowser(true)
        console.log('[MetaMaskBrowserFix] MetaMask browser detected, applying fixes...')
        
        // Forçar reinicialização do Web3Modal
        setTimeout(() => {
          forceReinitWeb3Modal()
        }, 500)

        // Aguardar um pouco mais e marcar como carregado
        setTimeout(() => {
          setIsLoading(false)
          console.log('[MetaMaskBrowserFix] Initialization complete')
        }, 2000)
      } else {
        setIsLoading(false)
      }
    }

    // Aguardar um pouco para garantir que tudo está carregado
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
          <p className="text-xs text-green-500 mt-2">Aguarde alguns segundos...</p>
        </div>
      </div>
    )
  }

  return null
}
