import React from 'react'
import { AppBar, AppBarProps, Button, Toolbar, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { isAddress } from 'web3-utils'

import { useAppSelector } from 'app/hooks'

interface AppbarProps extends AppBarProps {
  onConnect: () => Promise<void> | void
}

const Appbar: React.FC<AppbarProps> = ({ onConnect, ...props }) => {
  const current = useAppSelector((state) => state.user.current)

  return (
    <AppBar {...props}>
      <Container>
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>Land Sale</Typography>
          {isAddress(current) ? (
            <Button color="inherit" disabled>
              <Typography color="whitesmoke">
                {current.substring(0, 6)}
              </Typography>
            </Button>
          ) : (
            <Button color="inherit" onClick={onConnect}>
              Connect
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Appbar
