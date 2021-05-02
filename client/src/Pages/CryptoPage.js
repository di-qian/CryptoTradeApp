import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RealtimeChart from '../Components/Charts/RealtimeCharts';
import TradeForm from '../Components/TradeForms/TradeForm';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptos, listCryptosDetails } from '../actions/cryptoActions';
import { CRYPTO_LIST_DETAILS_RESET } from '../constants/cryptoConstants';

const CryptoPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;
  const userEmail = 'johndoe@gmail.com';
  const [openPrice, setOpenPrice] = useState({});

  useEffect(() => {
    dispatch(listCryptos());
    dispatch(listCryptosDetails(match.params.id, userEmail));
  }, [dispatch]);

  useEffect(() => {
    setCryptoOpenPrice();
  }, [crypto]);

  useEffect(() => {
    return () => {
      dispatch({ type: CRYPTO_LIST_DETAILS_RESET });
    };
  }, []);

  const setCryptoOpenPrice = () => {
    var tempQuery = '';
    if (crypto) {
      tempQuery = tempQuery + 'X:' + crypto.ticker + crypto.currency;

      const jsonify = (res) => res.json();
      const dataFetch = fetch(
        `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers?tickers=${tempQuery}&` +
          new URLSearchParams({
            apiKey: process.env.REACT_APP_APIKEY,
          })
      )
        .then(jsonify)
        .then((data) => {
          processCurrData(data.tickers);
        });
    }
  };

  const processCurrData = (curr_DataSet) => {
    var processData;
    curr_DataSet.map((currData) => {
      processData = { o: currData.prevDay.c };
    });

    setOpenPrice(processData);
  };

  return (
    <>
      <Container>
        <Row>
          <Col xs={12} md={8}>
            <RealtimeChart openPrice={openPrice.o} />
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
