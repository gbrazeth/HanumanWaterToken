'use client'

import { useEffect } from 'react'

export function ConsoleCleaner() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Interceptar imediatamente, antes de outros scripts
    const interceptConsole = () => {

    // Lista de mensagens para filtrar APENAS VISUALMENTE
    const visualFilters = [
      // Pocket Universe e extensões
      'pocket universe',
      'window.ethereum found',
      'window.phantom.solana found',
      'injected.js',
      'contentscript.js',
      'backpack couldn\'t override',
      
      // WalletConnect CORS (apenas visual)
      'origins don\'t match',
      'secure.walletconnect.org',
      'auth.magic.link',
      
      // Web3Modal informativos
      '[web3modal]',
      'web3modal initialized',
      'initialized successfully',
      
      // Erros de performance não críticos
      'was preloaded using link preload but not used',
      'loading chunk',
      'loading css chunk',
      
      // Permissions policy (já configurado no servidor)
      'permissions policy violation',
      'clipboard-read is not allowed',
      'clipboard-write is not allowed'
    ]

    // Função para verificar se deve filtrar visualmente
    const shouldFilterVisually = (message: string) => {
      if (!message) return false
      const lowerMessage = message.toLowerCase()
      return visualFilters.some(filter => lowerMessage.includes(filter))
    }

    // Interceptar apenas console.error e console.warn para limpeza visual
    const originalError = console.error
    const originalWarn = console.warn

    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      
      // Se for mensagem para filtrar, não mostrar no console
      // MAS permitir que a funcionalidade continue normalmente
      if (shouldFilterVisually(message)) {
        // Log silencioso para debugging se necessário (descomentado em dev)
        // console.debug('[FILTERED-ERROR]', message)
        return
      }
      
      // Mostrar todos os outros erros normalmente
      originalError.apply(console, args)
    }

    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      
      if (shouldFilterVisually(message)) {
        // console.debug('[FILTERED-WARN]', message)
        return
      }
      
      originalWarn.apply(console, args)
    }

    // Log de ativação para confirmar que está funcionando
    console.log('[ConsoleCleaner] Limpeza visual de console ativada - funcionalidade preservada')
    
    // Teste imediato para verificar se está funcionando
    console.error('origins don\'t match test - should be filtered')
    console.warn('pocket universe test - should be filtered')

    // Cleanup
    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
    }

    // Executar interceptação imediatamente
    interceptConsole()
  }, [])

  return null
}
