import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import { initWeb3Modal, isWeb3ModalInitialized } from '@/lib/web3modal-singleton';

export function useWeb3ModalSafe() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize if not already done
    if (!isWeb3ModalInitialized()) {
      initWeb3Modal();
    }
    setIsReady(true);
  }, []);

  // Only call useWeb3Modal after initialization
  try {
    const modal = useWeb3Modal();
    return { ...modal, isReady };
  } catch (error) {
    // If Web3Modal is not initialized yet, return dummy functions
    return {
      open: async () => {},
      close: () => {},
      isReady: false
    };
  }
}
