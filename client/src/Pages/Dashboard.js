import React, { useState, useEffect } from 'react';

import { Row, Col, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptos } from '../actions/cryptoActions';

import AssetPieChart from '../Components/Charts/AssetPieChart';
import AssetBalanceChart from '../Components/Charts/AssetBalanceChart';
import ProfolioTable from '../Components/DynamicTables/ProfolioTable';

const Dashboard = ({ history }) => {
  const dispatch = useDispatch();
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;
  const [latestData, setLatestData] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push('/auth/fail');
    } else {
      dispatch(listCryptos(userInfo._id));
    }
  }, [dispatch, history]);

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
      cryptos.map((crypto) => {
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
    let processData = [];
    curr_DataSet.map((currData) => {
      processData.push({
        o: currData.prevDay.c,
        p: currData.lastTrade.p,
        ticker: currData.ticker,
        t: currData.updated,
      });
    });

    setLatestData(processData);
  };

  return (
    <div className="container-fluid">
      <Row>
        <Col className="col-md-8">
          <AssetPieChart latestData={latestData} />
        </Col>
        <Col className="col-md-4">
          <ProfolioTable latestData={latestData} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
