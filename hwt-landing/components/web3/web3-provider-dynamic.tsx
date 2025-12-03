'use client'

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'
import { ClientOnly } from '@/components/client-only'

// Dynamic import para evitar SSR do Web3Provider
const Web3ProviderComponent = dynamic(
  () => import('./web3-provider').then(mod => ({ default: mod.Web3Provider })),
  {
    ssr: false,
    loading: () => <div suppressHydrationWarning>{/* Loading placeholder */}</div>
  }
)

interface Web3ProviderDynamicProps {
  children: ReactNode
  cookies?: string | null
}

export function Web3ProviderDynamic({ children, cookies }: Web3ProviderDynamicProps) {
  return (
    <ClientOnly fallback={<div suppressHydrationWarning>{children}</div>}>
      <Web3ProviderComponent cookies={cookies}>
        {children}
      </Web3ProviderComponent>
    </ClientOnly>
  )
}
