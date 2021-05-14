import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CryptoPage from './Pages/CryptoPage';
import Dashboard from './Pages/Dashboard';
import Homepage from './Pages/Homepage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import NoMatch from './Pages/404Page';
import NotAuthorized from './Pages/401Page';

toast.configure();

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/auth/dashboard" exact component={Dashboard} />
        <Route path="/cryptos/:id" exact component={CryptoPage} />
        <Route path="/" component={Homepage} exact />
        <Route path="/auth/fail" component={NotAuthorized} exact />

        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

export default App;
