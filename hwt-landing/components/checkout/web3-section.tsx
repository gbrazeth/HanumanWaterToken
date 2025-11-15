'use client'

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useWeb3ModalSafe } from '@/hooks/use-web3modal-safe';
import { Button } from "@/components/ui/button";
import { ClientOnly } from '@/components/client-only';

interface Web3SectionProps {
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected: boolean;
  address?: string;
  balance?: string;
}

function Web3SectionInner({ onConnect, onDisconnect }: Omit<Web3SectionProps, 'isConnected' | 'address' | 'balance'>) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open, isReady } = useWeb3ModalSafe();
  const { data: balanceData } = useBalance({
    address: address,
  });

  const handleConnect = () => {
    if (isReady) {
      open();
    }
    onConnect();
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect();
  };

  return (
    <div className="space-y-4">
      {isConnected && address ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Conectado: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          {balanceData && (
            <p className="text-sm text-gray-600">
              Saldo: {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
            </p>
          )}
          <Button onClick={handleDisconnect} variant="outline" size="sm">
            Desconectar
          </Button>
        </div>
      ) : (
        <Button onClick={handleConnect} disabled={!isReady}>
          Conectar Carteira
        </Button>
      )}
    </div>
  );
}

export function Web3Section(props: Web3SectionProps) {
  return (
    <ClientOnly 
      fallback={
        <div className="space-y-4">
          <Button disabled>Carregando...</Button>
        </div>
      }
    >
      <Web3SectionInner 
        onConnect={props.onConnect}
        onDisconnect={props.onDisconnect}
      />
    </ClientOnly>
  );
}
