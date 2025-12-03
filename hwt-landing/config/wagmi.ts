import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

if (!projectId) throw new Error('Project ID is not defined')

// Networks configuration
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet]

// Metadata for the app
export const metadata = {
  name: 'Hanuman Water Token',
  description: 'Hanuman Water Token - The First Token Backed by Millennial Hyperthermal Mineral Water',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://hanumanwatertoken.com',
  icons: ['https://hanumanwatertoken.com/images/logos/hwt-logo.png']
}

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})

// Export wagmi config for compatibility
export const config = wagmiAdapter.wagmiConfig
