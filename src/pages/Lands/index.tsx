import React from 'react'
import { Container } from '@mui/system'
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import MoneyOffIcon from '@mui/icons-material/MoneyOff'

import { useAppDispatch, useAppSelector } from 'app/hooks'
import { fetchListOfLands } from 'app/blockchain/api'

import { Land } from 'common/models/types'
import { isEthereumAddress } from 'common/utils/ethereum'
import { buyLand } from 'app/blockchain/actions'

const LandsPage = () => {
  const dispatch = useAppDispatch()
  const { contract } = useAppSelector((state) => state.blockchain)
  const { current } = useAppSelector((state) => state.user)

  const [lists, setLists] = React.useState<Land[]>([])
  const [landNameToBuy, setLandNameToBuy] = React.useState<string>('')
  const [isContractBuying, setIsContractBuying] = React.useState<boolean>(false)

  const fetchLandsForSale = React.useCallback(async () => {
    dispatch(fetchListOfLands())
      .unwrap()
      .then((response) => {
        setLists(response)
      })
      .catch((error) => console.warn(error))
  }, [dispatch])

  React.useEffect(() => {
    if (contract !== undefined) {
      fetchLandsForSale()
    }
  }, [contract, fetchLandsForSale])

  const handleBuyLand = React.useCallback(
    async (landName: string) => {
      const landId = Number(landName.replace(/^\D+/g, ''))

      setLandNameToBuy(landName)
      setIsContractBuying(true)
      dispatch(buyLand(landId))
        .then(() => {
          const listsCopy = [...lists]
          const IndexOfLandInLists = lists.findIndex(
            (land) => land.name === landName
          )
          listsCopy[IndexOfLandInLists].owner = current
          setLists(listsCopy)
        })
        .finally(() => {
          setLandNameToBuy('')
          setIsContractBuying(false)
        })
    },
    [dispatch, current, lists]
  )

  return (
    <Container maxWidth="lg">
      <List>
        {React.useMemo(
          () =>
            lists.map((list, index) => {
              const isEthereum = isEthereumAddress(list.owner)
              const isLandBeingBought = landNameToBuy === list.name
              const isBuyButtonDisabled = isEthereum || !current
              const buyButtonLabel = isEthereum
                ? 'Sold'
                : isLandBeingBought
                ? 'Buying'
                : 'Buy'

              return (
                <ListItem key={index}>
                  <ListItemIcon>
                    {isEthereum ? (
                      <MoneyOffIcon color="warning" />
                    ) : (
                      <LocalOfferIcon color="success" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={list.name}
                    secondary={
                      <>
                        <Box component="span">
                          <Typography variant="caption">X:</Typography>{' '}
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {list.posX}
                          </Typography>
                        </Box>
                        {' | '}
                        <Box component="span">
                          <Typography variant="caption">Y:</Typography>{' '}
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 'bold' }}
                          >
                            {list.posY}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      disableElevation
                      variant={isEthereum ? 'text' : 'contained'}
                      disabled={isBuyButtonDisabled}
                      sx={{
                        textTransform: 'none',
                        pointerEvents: isContractBuying ? 'none' : 'unset',
                      }}
                      onClick={
                        current ? () => handleBuyLand(list.name) : undefined
                      }
                      startIcon={
                        isLandBeingBought ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : undefined
                      }
                    >
                      {buyButtonLabel}
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            }),
          [lists, isEthereumAddress, current, isContractBuying, landNameToBuy]
        )}
      </List>
    </Container>
  )
}

export default LandsPage
