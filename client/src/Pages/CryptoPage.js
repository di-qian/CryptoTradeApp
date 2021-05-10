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
  const [tickers, setTickers] = useState({});

  useEffect(() => {
    dispatch(listCryptos());
    const ticker = 'X:' + match.params.id + 'USD';
    const jsonify = (res) => res.json();
    const results = fetch(
      `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&market=crypto&active=true&sort=ticker&order=asc&limit=1000&` +
        new URLSearchParams({
          apiKey: process.env.REACT_APP_APIKEY,
        })
    )
      .then(jsonify)
      .then((data) => {
        console.log(data);
        processTickerData(data.results[0]);
      });
  }, [dispatch, match.params.id]);

  const processTickerData = (currencyData) => {
    let processData = {
      base_currency_symbol: currencyData.base_currency_symbol,
      base_currency_name: currencyData.base_currency_name,
    };

    dispatch(listCryptosDetails(processData.base_currency_symbol, userEmail));
    setTickers(processData);
  };

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
    const jsonify = (res) => res.json();
    const dataFetch = fetch(
      `https://api.polygon.io/v1/last/crypto/${match.params.id}/USD?&` +
        new URLSearchParams({
          apiKey: process.env.REACT_APP_APIKEY,
        })
    )
      .then(jsonify)
      .then((data) => {
        var temp_btcprice = Number(data.last.price);

        setBtcPrice({ p: temp_btcprice });
      });
  };

  const setCryptoOpenPrice = () => {
    var tempQuery = '';

    tempQuery = tempQuery + 'X:' + match.params.id + 'USD';

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
            <RealtimeChart
              cryptoPrice={btcPrice.p}
              openPrice={openPrice.o}
              cryptoTickers={tickers}
            />
          </Col>
          <Col xs={6} md={4}>
            <TradeForm cryptoPrice={btcPrice.p} cryptoTickers={tickers} />

            <MyPosition cryptoPrice={btcPrice.p} openPrice={openPrice.o} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CryptoPage;
