import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

// import { Land } from 'common/models/types'

interface InitialState {
  web3?: Web3
  contract?: Contract
  safeGasPrice: number
  proposeGasPrice: number
  fastGasPrice: number
}

const initialState: InitialState = {
  safeGasPrice: 0,
  proposeGasPrice: 0,
  fastGasPrice: 0,
}

const slice = createSlice({
  name: 'blockchain',
  initialState,
  reducers: {
    setWeb3: (state, action: PayloadAction<Web3>) => {
      state.web3 = action.payload
    },
    setContract: (state, action: PayloadAction<Contract>) => {
      state.contract = action.payload
    },
    setGasPrices: (
      state,
      action: PayloadAction<{
        safeGasPrice: number
        proposeGasPrice: number
        fastGasPrice: number
      }>
    ) => {
      state.safeGasPrice = action.payload.safeGasPrice
      state.proposeGasPrice = action.payload.proposeGasPrice
      state.fastGasPrice = action.payload.fastGasPrice
    },
  },
  extraReducers: {
    // ['blockchain/fetchListOfLands/fulfilled']: (
    //   state,
    //   action: PayloadAction<Land[]>
    // ) => {},
  },
})

export const { setWeb3, setContract, setGasPrices } = slice.actions

export default slice.reducer
