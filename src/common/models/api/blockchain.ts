export interface FetchRecommendedGasFeeResponse {
  status: string
  message: string
  // return unit are in wei
  result: {
    LastBlock: string
    SafeGasPrice: string
    ProposeGasPrice: string
    FastGasPrice: string
    suggestBaseFee: string
    gasUsedRatio: string
  }
}
