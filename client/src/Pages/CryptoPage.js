import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RealtimeChart from '../Components/Charts/RealtimeCharts';
import TradeForm from '../Components/TradeForms/TradeForm';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptosDetails } from '../actions/cryptoActions';

const CryptoPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;
  const userEmail = 'johndoe@gmail.com';

  useEffect(() => {
    dispatch(listCryptosDetails(match.params.id, userEmail));
  }, [dispatch]);

  return (
    <>
      <Container>
        <Row>
          <Col xs={12} md={8}>
            <RealtimeChart />
          </Col>
          <Col xs={6} md={4}>
            <TradeForm />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CryptoPage;
