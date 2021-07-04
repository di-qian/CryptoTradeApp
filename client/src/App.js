import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CryptoPage from './Pages/CryptoPage';
import Dashboard from './Pages/Dashboard';
import DepositPage from './Pages/DepositPage';
import Homepage from './Pages/Homepage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import NoMatch from './Pages/404Page';
import NotAuthorized from './Pages/401Page';
import Footer from './Components/Footer';

toast.configure();

const stripePromise = loadStripe(
  'pk_test_51HWw1IKPIstrR68fGzaPGE3kgFt6H1Zmtc0ZKWDMhYD8Dbqb5UTqLR89w525v9raHnCBYQj9y2XSi0Dj26Lk3Q3J008gyJEzvl'
);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <Navbar />
        <main className="py-2">
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route path="/auth/dashboard" exact component={Dashboard} />
            <Route path="/auth/deposit" exact component={DepositPage} />
            <Route path="/cryptos/:id" exact component={CryptoPage} />
            <Route path="/" component={Homepage} exact />
            <Route path="/auth/fail" component={NotAuthorized} exact />

            <Route component={NoMatch} />
          </Switch>
        </main>
        <Footer />
      </Router>
    </Elements>
  );
}

export default App;
