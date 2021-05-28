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
  const { crypto } = cryptoListDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [openPrice, setOpenPrice] = useState({});
  const [btcPrice, setBtcPrice] = useState({});
  const [tickers, setTickers] = useState({});

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listCryptos(userInfo._id));
    }
  }, [dispatch, history, userInfo]);

  useEffect(() => {
    const ticker = 'X:' + match.params.id + 'USD';
    const jsonify = (res) => res.json();
    try {
      const results = async () =>
        await fetch(
          `https://api.polygon.io/v3/reference/tickers?ticker=${ticker}&market=crypto&active=true&sort=ticker&order=asc&limit=1000&` +
            new URLSearchParams({
              apiKey: process.env.REACT_APP_APIKEY,
            })
        )
          .then(jsonify)
          .then((data) => {
            const processTickerData = (currencyData) => {
              let processData = {
                base_currency_symbol: currencyData.base_currency_symbol,
                base_currency_name: currencyData.base_currency_name,
              };

              dispatch(
                listCryptosDetails(
                  processData.base_currency_symbol,
                  userInfo._id
                )
              );
              setTickers(processData);
            };

            processTickerData(data.results[0]);
          });
      results();
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, match.params.id, userInfo._id]);

  useEffect(() => {
    const setCryptoOpenPrice = () => {
      var tempQuery = '';

      tempQuery = tempQuery + 'X:' + match.params.id + 'USD';

      const jsonify = (res) => res.json();
      try {
        const dataFetch = () => {
          fetch(
            `https://api.polygon.io/v2/aggs/ticker/${tempQuery}/prev?unadjusted=true&` +
              new URLSearchParams({
                apiKey: process.env.REACT_APP_APIKEY,
              })
          )
            .then(jsonify)
            .then((data) => {
              processCurrData(data.results);
            });
        };
        dataFetch();
      } catch (err) {
        console.log(err);
      }
    };

    const processCurrData = (curr_DataSet) => {
      var processData;
      curr_DataSet.forEach((currData) => {
        processData = { o: currData.o };
      });

      setOpenPrice(processData);
    };

    setCryptoOpenPrice();

    const interval = setInterval(() => {
      const getBtcPrice = () => {
        const jsonify = (res) => res.json();
        try {
          const dataFetch = () => {
            fetch(
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
          dataFetch();
        } catch (err) {
          console.log(err);
        }
      };

      getBtcPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, [crypto, match.params.id]);

  useEffect(() => {
    return () => {
      dispatch({ type: CRYPTO_LIST_DETAILS_RESET });
    };
  }, [dispatch]);

  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={8}>
            <RealtimeChart
              cryptoPrice={btcPrice.p}
              openPrice={openPrice.o}
              cryptoTickers={tickers}
            />
          </Col>
          <Col sm={12} md={4}>
            <TradeForm cryptoPrice={btcPrice.p} cryptoTickers={tickers} />

            <MyPosition cryptoPrice={btcPrice.p} openPrice={openPrice.o} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CryptoPage;
