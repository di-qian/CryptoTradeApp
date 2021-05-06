import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RealtimeChart from '../Components/Charts/RealtimeCharts';
import TradeForm from '../Components/TradeForms/TradeForm';
import MyPosition from '../Components/DynamicTables/MyPosition';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptos, listCryptosDetails } from '../actions/cryptoActions';
import { CRYPTO_LIST_DETAILS_RESET } from '../constants/cryptoConstants';

const CryptoPage = ({ history, match }) => {
  const dispatch = useDispatch();
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;

  const userEmail = 'johndoe@gmail.com';
  const [openPrice, setOpenPrice] = useState({});
  const [btcPrice, setBtcPrice] = useState({});

  useEffect(() => {
    dispatch(listCryptos());
    dispatch(listCryptosDetails(match.params.id, userEmail));
  }, [dispatch]);

  useEffect(() => {
    setCryptoOpenPrice();
    const interval = setInterval(() => {
      getBtcPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, [crypto]);

  useEffect(() => {
    return () => {
      dispatch({ type: CRYPTO_LIST_DETAILS_RESET });
    };
  }, []);

  const getBtcPrice = () => {
    if (crypto) {
      const jsonify = (res) => res.json();
      const dataFetch = fetch(
        `https://api.polygon.io/v1/last/crypto/${crypto.ticker}/USD?&` +
          new URLSearchParams({
            apiKey: process.env.REACT_APP_APIKEY,
          })
      )
        .then(jsonify)
        .then((data) => {
          var temp_btcprice = Number(data.last.price);
          var temp_btcprice_rounded = temp_btcprice.toFixed(2);

          setBtcPrice({ p: temp_btcprice_rounded });
        });
    }
  };

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
            <RealtimeChart cryptoPrice={btcPrice.p} openPrice={openPrice.o} />
          </Col>
          <Col xs={6} md={4}>
            <TradeForm cryptoPrice={btcPrice.p} />

            <MyPosition cryptoPrice={btcPrice.p} openPrice={openPrice.o} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CryptoPage;
