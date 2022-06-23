import { AbiItem, isAddress } from 'web3-utils'

export const isEthereumPresent = (): boolean => {
  const { ethereum } = window
  return ethereum !== undefined
}

export const isEthereumAddress = (address: string): boolean => {
  return (
    address !== '0x0000000000000000000000000000000000000000' &&
    isAddress(address)
  )
}

export const getEntryProps = (
  contractAbi: AbiItem[],
  methodName: string
): string[] => {
  const methodAbiOutputs = contractAbi.find(
    (abi) => abi.name === methodName
  )?.outputs

  if (Array.isArray(methodAbiOutputs)) {
    if (methodAbiOutputs[0].components) {
      return methodAbiOutputs[0].components.map((c) => c.name)
    }
    return []
  }
  return []
}

export const decodeEntriesArray = (entryProps: string[], entries: any[][]) => {
  // workaround: https://github.com/ethereum/web3.js/issues/3591
  return entries.map((entry) => {
    return Object.fromEntries(
      entry.map((val, idx) => {
        return [entryProps[idx], val]
      })
    )
  })
}
