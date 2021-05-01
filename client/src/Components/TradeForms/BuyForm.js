import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, Nav, Form, Row, Col, Button } from 'react-bootstrap';
import './TradeForm.css';
import { listCryptos } from '../../actions/cryptoActions';

const BuyForm = () => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;

  useEffect(() => {
    //dispatch(listCryptos());
  }, []);

  const retrieveCashInfo = () => {
    const cash = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cash[0];
  };

  return (
    <div>
      <Form>
        <Form.Label className="TradeForm-intro">
          Total purchase power $
          {retrieveCashInfo() && retrieveCashInfo().quantity}
        </Form.Label>
        <hr />

        <Form.Group as={Row} controlId="formTradeAmount">
          <Form.Label column sm="6">
            Amount in USD
          </Form.Label>
          <Col sm="6">
            <Form.Control placeholder="$0.00" />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="BidPrice">
          <Form.Label column sm="6">
            Limited BTC Price
          </Form.Label>
          <Col sm="6">
            <Form.Control placeholder="$0.00" />
          </Col>
        </Form.Group>
        <br />
        <Form.Group as={Row}>
          <Col className="d-flex justify-content-center">
            <Button variant="outline-info" type="submit" block>
              Review Order
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default BuyForm;
