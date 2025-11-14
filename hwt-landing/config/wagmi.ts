import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Hanuman Water Token',
  description: 'Hanuman Water Token - The First Token Backed by Millennial Hyperthermal Mineral Water',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://hanumanwatertoken.com',
  icons: ['https://hanumanwatertoken.com/hwt-logo.png']
}

// Create wagmiConfig - usando apenas Mainnet para produção
const chains = [mainnet] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})
