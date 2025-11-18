import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config, projectId } from '@/config/wagmi'

// Singleton pattern for Web3Modal initialization
let initialized = false

export function initWeb3Modal() {
  if (typeof window === 'undefined') {
    return
  }

  // Detectar se estamos no browser MetaMask
  const isMetaMaskBrowser = /MetaMask/i.test(navigator.userAgent) && window.ethereum?.isMetaMask
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
  
  console.log('[Web3Modal] Initialization attempt:', {
    initialized,
    isMetaMaskBrowser,
    isMobile,
    projectId: projectId ? 'present' : 'missing'
  })

  // Para MetaMask browser mobile, forçar reinicialização se necessário
  if (isMetaMaskBrowser && isMobile && initialized) {
    console.log('[Web3Modal] MetaMask browser detected, forcing reinitialization...')
    initialized = false
  }

  if (initialized) {
    console.log('[Web3Modal] Already initialized, skipping...')
    return
  }

  if (projectId && projectId !== 'YOUR_PROJECT_ID') {
    try {
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        enableAnalytics: false,
        enableOnramp: true,
        themeMode: 'light'
      })
      initialized = true
      console.log('[Web3Modal] Initialized successfully for', isMetaMaskBrowser ? 'MetaMask browser' : 'regular browser')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.log('[Web3Modal] Initialization error:', errorMessage)
      
      if (errorMessage.includes('already initialized')) {
        initialized = true
        console.log('[Web3Modal] Marked as initialized (was already done)')
      } else {
        console.error('[Web3Modal] Failed to initialize:', error)
        
        // Para MetaMask browser, tentar novamente após um delay
        if (isMetaMaskBrowser && isMobile) {
          console.log('[Web3Modal] Retrying initialization for MetaMask browser...')
          setTimeout(() => {
            try {
              createWeb3Modal({
                wagmiConfig: config,
                projectId,
                enableAnalytics: false,
                enableOnramp: true,
                themeMode: 'light'
              })
              initialized = true
              console.log('[Web3Modal] Retry successful for MetaMask browser')
            } catch (retryError) {
              console.error('[Web3Modal] Retry failed:', retryError)
            }
          }, 1000)
        }
      }
    }
  } else {
    console.error('[Web3Modal] Missing or invalid projectId:', projectId)
  }
}

export function isWeb3ModalInitialized() {
  return initialized
}

export function forceReinitWeb3Modal() {
  console.log('[Web3Modal] Forcing reinitialization...')
  initialized = false
  initWeb3Modal()
}
