import React from 'react'
import { Provider } from 'react-redux'
import { CssBaseline } from '@mui/material'

import { ThemeProvider } from '@mui/material/styles'

import { store } from 'app/store'

import Routes from 'routes'
import theme from 'common/theme/theme'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Routes />
      </ThemeProvider>
    </Provider>
  )
}

export default App
