'use client'

import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { State, WagmiProvider } from 'wagmi'
import { config } from '@/config/wagmi'
import { Web3ModalInit } from './web3-modal-init'
import { logger } from '@/lib/logger'

// Setup queryClient
const queryClient = new QueryClient()

export function Web3Provider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Sobrescrever console.error para filtrar erros não críticos
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]?.toString()?.toLowerCase() || ''
      const nonCriticalErrors = [
        'origins don\'t match',
        'secure.walletconnect.org',
        'failed to fetch',
        'network error',
        'fetch error',
        'walletconnect'
      ]
      
      // Se for erro não crítico, apenas log silencioso
      if (nonCriticalErrors.some(err => message.includes(err))) {
        logger.debug('Non-critical WalletConnect warning suppressed', { message: args[0] })
        return
      }
      
      // Caso contrário, mostra o erro normalmente
      originalError.apply(console, args)
    }

    // Suprimir erros não tratados do WalletConnect que não afetam funcionalidade
    const handleError = (event: ErrorEvent) => {
      const message = event.message?.toLowerCase() || ''
      const nonCriticalErrors = [
        'origins don\'t match',
        'secure.walletconnect.org',
        'failed to fetch',
        'network error',
        'fetch error'
      ]
      
      if (nonCriticalErrors.some(err => message.includes(err))) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
        return false
      }
    }

    // Suprimir erros de promise não tratados
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.toString()?.toLowerCase() || ''
      const nonCriticalErrors = [
        'failed to fetch',
        'network error',
        'fetch error',
        'walletconnect',
        'origins don\'t match'
      ]
      
      if (nonCriticalErrors.some(err => reason.includes(err))) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    window.addEventListener('error', handleError, true) // Capture phase
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true)

    return () => {
      console.error = originalError
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true)
    }
  }, [])

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <Web3ModalInit />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
