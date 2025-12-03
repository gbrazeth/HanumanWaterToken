'use client'

import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { createAppKit } from '@reown/appkit/react'
import { wagmiAdapter, projectId, networks, metadata } from '@/config/wagmi'

// Setup queryClient with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

// Create AppKit modal (singleton)
let appKitInitialized = false

function initAppKit() {
  if (appKitInitialized || typeof window === 'undefined') return
  
  try {
    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks,
      metadata,
      themeMode: 'light',
      features: {
        analytics: false,
        email: true,
        socials: ['google', 'x', 'discord', 'apple', 'github'],
        emailShowWallets: true
      },
      themeVariables: {
        '--w3m-accent': '#3F5767',
      }
    })
    appKitInitialized = true
    console.log('[AppKit] Initialized successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('already initialized') || errorMessage.includes('AppKit already exists')) {
      appKitInitialized = true
      console.log('[AppKit] Already initialized')
    } else {
      console.error('[AppKit] Initialization error:', error)
    }
  }
}

export function Web3Provider({
  children,
  cookies
}: {
  children: ReactNode
  cookies?: string | null
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    initAppKit()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return

    // Suprimir erros não críticos de extensões e WalletConnect
    const originalError = console.error
    const nonCriticalErrors = [
      'origins don\'t match',
      'secure.walletconnect.org',
      'failed to fetch',
      'network error',
      'walletconnect',
      'cors',
      'cross-origin',
      'pocket universe',
      'backpack couldn\'t override',
      'injected.js',
      'contentscript.js',
      'chrome-extension'
    ]

    console.error = (...args: any[]) => {
      const message = args[0]?.toString()?.toLowerCase() || ''
      if (nonCriticalErrors.some(err => message.includes(err))) {
        return // Suprimir silenciosamente
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [mounted])

  // Get initial state from cookies for SSR
  const initialState = cookies 
    ? cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)
    : undefined

  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
