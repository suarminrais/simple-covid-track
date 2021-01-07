import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import DataPreview from '../pages/data/index'
import Home from '../pages/home/index'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/data" exact component={DataPreview} />
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
  )
}

export default App
