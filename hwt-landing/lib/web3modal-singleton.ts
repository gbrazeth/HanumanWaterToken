import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config, projectId } from '@/config/wagmi'

// Singleton pattern for Web3Modal initialization
let initialized = false

export function initWeb3Modal() {
  if (initialized || typeof window === 'undefined') {
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
      console.log('[Web3Modal] Initialized successfully')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (!errorMessage.includes('already initialized')) {
        console.error('[Web3Modal] Failed to initialize:', error)
      } else {
        initialized = true // Mark as initialized even if error says it's already done
      }
    }
  }
}

export function isWeb3ModalInitialized() {
  return initialized
}
