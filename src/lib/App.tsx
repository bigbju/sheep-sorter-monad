'use client';

import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { SubmitScoreButton } from './SubmitScoreButton';
import { ConnectWallet } from './ConnectWallet';

export default function App() {
  const { address, isConnected } = useAccount();

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 20 }}>
      {isConnected ? (
        <>
          <p>Connected: {address}</p>
          <SubmitScoreButton />
        </>
      ) : (
        <ConnectWallet />
      )}
    </div>
  );
}
