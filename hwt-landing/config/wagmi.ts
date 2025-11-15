import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage, noopStorage } from 'wagmi'
import { mainnet } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Hanuman Water Token',
  description: 'Hanuman Water Token - The First Token Backed by Millennial Hyperthermal Mineral Water',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://hanumanwatertoken.com',
  icons: ['/images/logos/hwt-logo.png']
}

// Create wagmiConfig - usando apenas Mainnet para produção
const chains = [mainnet] as const

// Função para criar config de forma lazy
function createWagmiConfig() {
  // SSR-safe storage configuration
  const storage = typeof window !== 'undefined' 
    ? createStorage({
        storage: cookieStorage
      })
    : createStorage({
        storage: noopStorage
      })

  return defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage,
  })
}

// Export config como getter para evitar execução no servidor
export const getConfig = () => {
  if (typeof window === 'undefined') {
    // No servidor, retorna config mínimo
    return createWagmiConfig()
  }
  return createWagmiConfig()
}

// Manter export direto para compatibilidade
export const config = createWagmiConfig()
