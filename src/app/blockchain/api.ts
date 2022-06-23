import { createAsyncThunk } from '@reduxjs/toolkit'
import { AbiItem } from 'web3-utils'

import { RootState } from 'app/store'
import { Land } from 'common/models/types'
import { FetchRecommendedGasFeeResponse } from 'common/models/api'
import { decodeEntriesArray, getEntryProps } from 'common/utils/ethereum'

import abi from 'common/assets/files/abi.json'

export const fetchListOfLands = createAsyncThunk<
  Land[],
  void,
  { state: RootState }
>('blockchain/fetchListOfLands', async (_, { getState, rejectWithValue }) => {
  try {
    const state: RootState = getState()
    const { contract } = state.blockchain

    if (contract !== undefined) {
      const response = await contract.methods.getLands().call()
      const entries = getEntryProps(abi as unknown as AbiItem[], 'getLands')
      const result = decodeEntriesArray(entries, response)
      return result as Land[]
    }
    return rejectWithValue({
      code: 405,
      message: 'Contract is not initialized.',
    })
  } catch (e: unknown) {
    return rejectWithValue(e)
  }
})

export const postBuyLand = createAsyncThunk<void, number, { state: RootState }>(
  'blockchain/postBuyLand',
  async (_landId, { getState, rejectWithValue }) => {
    try {
      const state: RootState = getState()
      const { contract } = state.blockchain

      if (contract !== undefined) {
        return await contract.methods.mint
      }
      return rejectWithValue({
        code: 405,
        message: 'Contract is not initialized.',
      })
    } catch (error: unknown) {
      return rejectWithValue(error)
    }
  }
)

export const fetchRecommendedGasFee = createAsyncThunk<
  FetchRecommendedGasFeeResponse,
  void
>('blockchain/fetchRecommendedGasFee', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
    )
      .then((response) => response.json())
      .then((response: FetchRecommendedGasFeeResponse) => {
        return response
      })
    return response
  } catch (error: unknown) {
    return rejectWithValue(error)
  }
})
