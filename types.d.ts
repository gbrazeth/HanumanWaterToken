interface Window {
  ethereum?: {
    isMetaMask?: boolean
    request: (request: { method: string; params?: any[] }) => Promise<any>
  }
  google?: {
    accounts: {
      id: {
        initialize: (config: any) => void
        renderButton: (element: HTMLElement | null, options: any) => void
        prompt: (callback?: (notification: any) => void) => void
      }
    }
  }
  open: (url: string, target: string, features: string) => Window | null
}

