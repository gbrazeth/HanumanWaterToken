'use client'

import { useEffect, useRef } from 'react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config, projectId } from '@/config/wagmi'
import { logger } from '@/lib/logger'

// Global flag to prevent multiple initializations across all instances
let globalInitialized = false

export function Web3ModalInit() {
  const localInitialized = useRef(false)

  useEffect(() => {
    // Skip if already initialized globally or locally
    if (globalInitialized || localInitialized.current || typeof window === 'undefined') {
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
        globalInitialized = true
        localInitialized.current = true
        logger.info('WalletConnect initialized successfully')
      } catch (error) {
        // Silently ignore if already initialized
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (!errorMessage.includes('already initialized')) {
          logger.error('Failed to initialize WalletConnect', error)
        }
      }
    }
  }, [])

  return null
}
