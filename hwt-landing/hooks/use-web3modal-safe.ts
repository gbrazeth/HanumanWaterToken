import { useAppKit } from '@reown/appkit/react';
import { useEffect, useState } from 'react';

export function useWeb3ModalSafe() {
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Give AppKit time to initialize
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted]);

  // Only call useAppKit after mounting
  try {
    if (!mounted || !isReady) {
      return {
        open: async () => {},
        close: () => {},
        isReady: false
      };
    }

    const modal = useAppKit();
    return { ...modal, isReady };
  } catch (error) {
    // If AppKit is not initialized yet, return dummy functions
    return {
      open: async () => {},
      close: () => {},
      isReady: false
    };
  }
}
