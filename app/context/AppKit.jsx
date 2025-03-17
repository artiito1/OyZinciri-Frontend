'use client'

import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet,sepolia } from '@reown/appkit/networks'

// 1. Get projectId at https://cloud.reown.com
const projectId = '8ac477a997754b02ae7fa94f109f2353'

// 2. Create a metadata object
const metadata = {
  name: 'Voting Dao',
  description: 'Decentralized voter dao by ahmed tit',
  url: 'https://www.ahmedtate.org/', // origin must match your domain & subdomain
  icons: ['https://blogger.googleusercontent.com/img/a/AVvXsEiUxtert5gFj7-KCeJ67FmSD017lMR6eluNIAz98_QtNVQWlSAy78MwAOuZArofe1T3arxMVEpGnKuaup6c75kxvK7oySQX0hO7qRYKRDtPmhCTiZBDXuuOrhA7ebEi1j1KB5HUkg6-ru4ccGyboT59W6dfOsE8Y8b7YM7UMTOyW0pq5nmRMThFRpjJUQ=s307']
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet,sepolia],
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

export function AppKit({children}) {
  return (
    <>{children}</> //make sure you have configured the <appkit-button> inside
  )
}