'use client'

import { useEffect, useState } from 'react'
import { initWeb3Modal } from '@/lib/web3modal-singleton'

export function Web3ModalInit() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    // Initialize on mount with delay to ensure client-side
    const timer = setTimeout(() => {
      initWeb3Modal()
    }, 100)

    return () => clearTimeout(timer)
  }, [mounted])

  return null
}
