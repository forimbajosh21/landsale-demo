import React from 'react'
import { Maybe } from '@metamask/providers/dist/utils'

import { useAppDispatch } from 'app/hooks'
import { isEthereumPresent } from 'common/utils/ethereum'
import {
  connectToSmartContract,
  handleAccountChanged,
  connectMetamask,
} from 'app/blockchain/actions'

import Appbar from 'common/components/base/Appbar'
import { Outlet } from 'react-router-dom'

const AppWrapperLayout: React.FC = () => {
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    // initialize connection to smart contract
    dispatch(connectToSmartContract())

    // https://docs.metamask.io/guide/ethereum-provider.html#events
    window.ethereum?.on('accountChanged', (accounts) => {
      console.log(accounts)
      dispatch(handleAccountChanged(accounts as Maybe<string[]>))
    })
    window.ethereum?.on('chainChanged', () => {
      window.location.reload()
    })

    // clean up listener
    return () => {
      window.ethereum?.removeListener('accountChanged', (accounts) => {
        console.log(accounts)
        dispatch(handleAccountChanged(accounts as Maybe<string[]>))
      })
      window.ethereum?.removeListener('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

  const handleOnConnectMetamask = React.useCallback(() => {
    if (isEthereumPresent()) {
      dispatch(connectMetamask())
    }
  }, [dispatch])

  return (
    <>
      <Appbar
        elevation={1}
        position="relative"
        onConnect={handleOnConnectMetamask}
      />
      <Outlet />
    </>
  )
}

export default AppWrapperLayout
