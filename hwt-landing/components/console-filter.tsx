'use client'

import { useEffect } from 'react'

export function ConsoleFilter() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Lista de mensagens para filtrar APENAS VISUALMENTE
    const visualFilters = [
      'origins don\'t match',
      'secure.walletconnect.org',
      'pocket universe',
      'window.ethereum found',
      'window.phantom.solana found',
      'injected.js',
      'contentscript.js'
    ]

    // Função para verificar se deve filtrar visualmente
    const shouldFilterVisually = (message: string) => {
      const lowerMessage = message.toLowerCase()
      return visualFilters.some(filter => lowerMessage.includes(filter))
    }

    // Sobrescrever APENAS console.error para filtrar visualmente
    // Não interferir com a funcionalidade real
    const originalError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      
      // Se for mensagem para filtrar, apenas não mostrar no console
      // MAS permitir que a funcionalidade continue normalmente
      if (shouldFilterVisually(message)) {
        // Log silencioso para debugging se necessário
        // originalError('[FILTERED]', message)
        return
      }
      
      // Mostrar todos os outros erros normalmente
      originalError.apply(console, args)
    }

    // Cleanup simples
    return () => {
      console.error = originalError
    }
  }, [])

  return null
}
