import React, { useState, useEffect } from 'react';

import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptos } from '../actions/cryptoActions';

import AssetPieChart from '../Components/Charts/AssetPieChart';

import ProfolioTable from '../Components/DynamicTables/ProfolioTable';
import AssetBalanceTable from '../Components/DynamicTables/AssetBalanceTable';

const Dashboard = ({ history }) => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { cryptos } = cryptoList;

  const [total_worth_v, setTotal_worth_v] = useState(0);
  const [latestData, setLatestData] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listCryptos(userInfo._id));
    }
  }, [dispatch, history, userInfo]);

  useEffect(() => {
    const interval = setInterval(() => {
      getCryptosPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, [cryptos]);

  const getCryptosPrice = () => {
    var count = 0;
    var tempQuery = '';

    cryptos &&
      cryptos.forEach((crypto) => {
        if (crypto.asset_name !== 'Cash') {
          tempQuery = tempQuery + 'X:' + crypto.asset_ticker + 'USD';

          if (count < cryptos.length - 2) {
            tempQuery = tempQuery + ',';
          }
          count = count + 1;
        }
      });

    if (tempQuery !== '') {
      const jsonify = (res) => res.json();
      try {
        const dataFetch = () => {
          fetch(
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
        dataFetch();
      } catch (err) {
        console.log(err);
      }
    } else {
      processCashData();
    }
  };

  const processCurrData = (curr_DataSet) => {
    let processData = [];
    var asset_quantity = 0;
    var total_worth = 0;

    total_worth = cryptos.filter((crypto) => crypto.asset_ticker === 'Cash')[0]
      .quantity;

    curr_DataSet.forEach((currData) => {
      processData.push({
        o: currData.prevDay.c,
        p: currData.lastTrade.p,
        ticker: currData.ticker,
        t: currData.updated,
      });

      asset_quantity = cryptos.filter(
        (crypto) => 'X:' + crypto.asset_ticker + 'USD' === currData.ticker
      )[0].quantity;

      total_worth += asset_quantity * currData.lastTrade.p;
    });

    setTotal_worth_v(total_worth);
    setLatestData(processData);
  };

  const processCashData = () => {
    var total_worth = 0;

    total_worth = cryptos.filter((crypto) => crypto.asset_ticker === 'Cash')[0]
      .quantity;

    setTotal_worth_v(total_worth);
  };

  return (
    <>
      <Container>
        <Row>
          <Col sm={12} md={12} lg={4}>
            <AssetBalanceTable
              total_worth_v={total_worth_v}
              latestData={latestData}
            />
          </Col>
          <Col sm={12} md={6} lg={4}>
            <AssetPieChart
              total_worth_v={total_worth_v}
              latestData={latestData}
            />
          </Col>
          <Col sm={12} md={6} lg={4}>
            <ProfolioTable latestData={latestData} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
