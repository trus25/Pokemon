import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/external/Navbar'
import Detail from './components/pages/Detail'
import Home from './components/pages/Home'
import Pokemon from './components/pages/Pokemon'
// import Pokemon from './pages/Pokemon'
// import NotFound from './pages/NotFound'

function Routes() {

    return (
        <BrowserRouter>
            <Navbar />
            <Switch>                
                <Route path="/pokemon/:name" component={Detail} />
                <Route path="/pokemon" component={Pokemon} />
                <Route path="/" component={Home} />
                {/* <Route path="*" component={NotFound} /> */}
            </Switch>
        </BrowserRouter>
    )
}

export default Routes