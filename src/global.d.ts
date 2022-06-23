import { MetaMaskInpageProvider } from '@metamask/providers'

declare module 'json-immutable'

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SMART_CONTRACT_ADDRESS: string
      REACT_APP_CHAIN_ID: string
      REACT_APP_ETHERSCAN_API_KEY: string
    }
  }
}

// Adding this exports the declaration file which Typescript/CRA can now pickup:
export {}
