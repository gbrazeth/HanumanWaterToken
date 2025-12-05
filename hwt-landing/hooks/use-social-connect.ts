'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Wallet } from '@reown/appkit-wallet-button'

// Tipo para a instância do wallet button
interface WalletButtonInstance {
  isReady: () => boolean | undefined
  connect: (wallet: Wallet) => Promise<any>
  subscribeIsReady: (callback: (data: { isReady: boolean }) => void) => void
}

let walletButtonInstance: WalletButtonInstance | null = null

async function getWalletButton(): Promise<WalletButtonInstance> {
  if (walletButtonInstance) return walletButtonInstance
  
  const { createAppKitWalletButton } = await import('@reown/appkit-wallet-button')
  walletButtonInstance = createAppKitWalletButton() as WalletButtonInstance
  return walletButtonInstance
}

export function useSocialConnect() {
  const [isReady, setIsReady] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    let mounted = true
    
    getWalletButton().then((wb) => {
      if (mounted) {
        // Usar o subscribe para saber quando está pronto
        wb.subscribeIsReady(({ isReady: ready }) => {
          if (mounted && ready) {
            setIsReady(true)
          }
        })
        
        // Verificar se já está pronto
        if (wb.isReady()) {
          setIsReady(true)
        }
      }
    })
    
    return () => {
      mounted = false
    }
  }, [])

  const connectWithGoogle = useCallback(async () => {
    try {
      setIsConnecting(true)
      const wb = await getWalletButton()
      if (wb.isReady()) {
        await wb.connect('google' as Wallet)
      }
    } catch (error) {
      console.error('Erro ao conectar com Google:', error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const connectWithEmail = useCallback(async () => {
    try {
      setIsConnecting(true)
      const wb = await getWalletButton()
      if (wb.isReady()) {
        await wb.connect('email' as Wallet)
      }
    } catch (error) {
      console.error('Erro ao conectar com Email:', error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const connectWithApple = useCallback(async () => {
    try {
      setIsConnecting(true)
      const wb = await getWalletButton()
      if (wb.isReady()) {
        await wb.connect('apple' as Wallet)
      }
    } catch (error) {
      console.error('Erro ao conectar com Apple:', error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [])

  return {
    isReady,
    isConnecting,
    connectWithGoogle,
    connectWithEmail,
    connectWithApple
  }
}
