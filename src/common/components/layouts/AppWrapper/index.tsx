import React from 'react'
import Appbar from 'common/components/base/Appbar'
import { Outlet } from 'react-router-dom'
import { Alert, Snackbar } from '@mui/material'
import { Maybe } from '@metamask/providers/dist/utils'

import { useAppDispatch } from 'app/hooks'
import { isEthereumPresent } from 'common/utils/ethereum'
import {
  connectToSmartContract,
  handleAccountChanged,
  connectMetamask,
} from 'app/blockchain/actions'

const AppWrapperLayout: React.FC = () => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = React.useState(false)

  const handleClose = () => setOpen(false)

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
  }, [dispatch])

  const handleOnConnectMetamask = React.useCallback(() => {
    if (isEthereumPresent()) {
      dispatch(connectMetamask())
    } else {
      setOpen(true)
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
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          Please install Metamask and refresh page
        </Alert>
      </Snackbar>
    </>
  )
}

export default AppWrapperLayout
