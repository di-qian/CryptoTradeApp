import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CryptoPage from './Pages/CryptoPage';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/cryptos/:id" exact component={CryptoPage} />
      </Switch>
    </Router>
  );
}

export default App;
