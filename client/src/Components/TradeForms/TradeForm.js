import React, { useState, useEffect } from 'react';

import { Container, Tab, Tabs, Form, Row, Col, Button } from 'react-bootstrap';
import './TradeForm.css';
import BuyForm from './BuyForm';
import SellForm from './SellForm';

const TradeForm = () => {
  const [key, setKey] = useState('buy');

  return (
    <>
      <br />
      <div>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="buy" title="Buy">
            <BuyForm />
          </Tab>
          <Tab eventKey="sell" title="Sell">
            <SellForm />
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default TradeForm;
