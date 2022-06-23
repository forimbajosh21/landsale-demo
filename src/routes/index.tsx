import React from 'react'
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'

import AppWrapperLayout from 'common/components/layouts/AppWrapper'

// pages
import LandsPage from 'pages/Lands'

const Routes = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path="/" element={<AppWrapperLayout />}>
          <Route index element={<LandsPage />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  )
}

export default Routes
