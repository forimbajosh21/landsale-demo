export interface Config {
  CONTRACT_ADDRESS: string
  SCAN_LINK: string
  NETWORK: {
    NAME: string
    SYMBOL: string
    ID: number
  }
  NFT_NAME: string
  SYMBOL: string
  MAX_SUPPLY: number
  WEI_COST: number
  DISPLAY_COST: number
  GAS_LIMIT: number
  MARKETPLACE: string
  MARKETPLACE_LINK: string
  SHOW_BACKGROUND: boolean
}
