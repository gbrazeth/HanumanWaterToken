import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect, useState } from 'react';
import { initWeb3Modal, isWeb3ModalInitialized } from '@/lib/web3modal-singleton';

export function useWeb3ModalSafe() {
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Initialize if not already done
    const timer = setTimeout(() => {
      if (!isWeb3ModalInitialized()) {
        initWeb3Modal();
      }
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted]);

  // Only call useWeb3Modal after initialization and mounting
  try {
    if (!mounted || !isReady) {
      return {
        open: async () => {},
        close: () => {},
        isReady: false
      };
    }

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
