import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { Maybe } from '@metamask/providers/dist/utils'

import { RootState, AppDispatch } from 'app/store'
import { setContract, setGasPrices, setWeb3 } from '.'
import { setCurrentUser } from 'app/user'

import { ErrorTrace } from 'common/models/types'
import { fetchRecommendedGasFee } from './api'

import abi from 'common/assets/files/abi.json'

export const connectToSmartContract =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    const { ethereum } = window

    if (ethereum !== undefined) {
      const web3 = new Web3(Web3.givenProvider)
      const chainId = await ethereum.request({ method: 'eth_chainId' })

      // check whether they are on the same chain id/network (https://chainlist.org/)
      if (process.env.REACT_APP_CHAIN_ID === chainId) {
        // create smart contract connection
        const contract = new web3.eth.Contract(
          abi as unknown as AbiItem | AbiItem[],
          process.env.REACT_APP_SMART_CONTRACT_ADDRESS
        )
        dispatch(setWeb3(web3))
        dispatch(setContract(contract))
      }
    }
  }

export const handleAccountChanged =
  (accounts: Maybe<string[]>) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const { current } = getState().user

    if (Array.isArray(accounts)) {
      if (accounts.length === 0) {
        // no account in the list
        dispatch(setCurrentUser(''))
      } else if (accounts[0] !== current) {
        dispatch(setCurrentUser(accounts[0] || '0'))
      } else {
        // fallback, set to no account
        dispatch(setCurrentUser(''))
      }
    } else {
      // fallback, set to no account
      dispatch(setCurrentUser(''))
    }
  }

/**
 * Connects Metamask
 * https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
 * @returns void
 */
export const connectMetamask =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const { ethereum } = window

      if (ethereum !== undefined) {
        // request connection to Metamask account
        const accounts: Maybe<string[]> = await ethereum.request({
          method: 'eth_requestAccounts',
        })

        dispatch(handleAccountChanged(accounts))
      }
    } catch (error: unknown) {
      if ((error as ErrorTrace).code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.info('Please connect to MetaMask.')
      } else {
        console.warn(error)
      }
    }
  }

export const buyLand =
  (landId: number) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    try {
      const { contract, proposeGasPrice, fastGasPrice } = getState().blockchain
      const { current } = getState().user

      if (contract !== undefined) {
        await contract.methods.mint(landId).send({
          // https://web3js.readthedocs.io/en/v1.7.3/web3-eth-contract.html?highlight=send#id35
          from: current,
          gasPrice: proposeGasPrice,
          gas: fastGasPrice,
        })
      }
    } catch (error: unknown) {
      console.warn(error)
      throw new Error((error as ErrorTrace).message)
    }
  }

export const handleFetchGasPrices =
  () =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      await dispatch(fetchRecommendedGasFee())
        .unwrap()
        .then((response) => {
          dispatch(
            setGasPrices({
              safeGasPrice: parseInt(response.result.SafeGasPrice),
              proposeGasPrice: parseInt(response.result.ProposeGasPrice),
              fastGasPrice: parseInt(response.result.FastGasPrice),
            })
          )
        })
    } catch (error) {
      console.warn(error)
    }
  }
