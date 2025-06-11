'use client'

import { WagmiConfig, useAccount, useConnect, useDisconnect } from 'wagmi'
import { config } from './lib/web3'

function ConnectButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div>
        <p>Connected: {address}</p>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          Connect with {connector.name}
        </button>
      ))}
    </div>
  )
}

export default function AppWrapper() {
  return (
    <WagmiConfig config={config}>
      <ConnectButton />
      {/* решта гри */}
    </WagmiConfig>
  )
}
