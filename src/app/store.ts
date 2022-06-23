import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'

import blockchainReducer from './blockchain'
import userReducer from './user'

export const store = configureStore({
  reducer: {
    blockchain: blockchainReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['blockchain/setWeb3', 'blockchain/setContract'],
        // Ignore these paths in the state
        ignoredPaths: ['blockchain.web3', 'blockchain.contract'],
      },
    }),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
