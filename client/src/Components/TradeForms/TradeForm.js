import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Tab, Tabs } from 'react-bootstrap';
import './TradeForm.css';
import { useSelector } from 'react-redux';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

const TradeForm = ({ cryptoPrice, cryptoTickers }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { crypto } = cryptoListDetails;
  const [key, setKey] = useState('buy');

  const buyorderStatusToast = (e) => {
    key === 'buy' && toast.success(e);
  };

  const sellorderStatusToast = (e) => {
    key === 'sell' && toast.success(e);
  };

  return (
    <>
      <br />
      <div>
        <Tabs
          id="controlled-tab-example"
          activeKey={crypto && !crypto.not_own ? key : 'buy'}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="buy" title="Buy">
            <BuyForm
              cryptoPrice={cryptoPrice}
              cryptoTickers={cryptoTickers}
              buyorderStatusToast={buyorderStatusToast}
            />
          </Tab>
          {crypto && !crypto.not_own && (
            <Tab eventKey="sell" title="Sell">
              <SellForm
                cryptoPrice={cryptoPrice}
                cryptoTickers={cryptoTickers}
                sellorderStatusToast={sellorderStatusToast}
              />
            </Tab>
          )}
        </Tabs>
        <ToastContainer />
      </div>
    </>
  );
};

export default TradeForm;
