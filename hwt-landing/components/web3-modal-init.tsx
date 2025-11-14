'use client'

import { useEffect } from 'react'
import { initWeb3Modal } from '@/lib/web3modal-singleton'

export function Web3ModalInit() {
  useEffect(() => {
    // Initialize on mount
    initWeb3Modal()
  }, [])

  return null
}
