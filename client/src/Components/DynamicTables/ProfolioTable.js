import React, { useState, useEffect } from 'react';
import './ProfolioTable.css';

import ProfolioTableRow from './ProfolioTableRow';
import { useDispatch, useSelector } from 'react-redux';

const ProfolioTable = () => {
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;
  const [query, setQuery] = useState('');
  const [latestData, setLatestData] = useState([]);

  useEffect(() => {
    setInterval(function () {
      getCryptosPrice();
    }, 1000);
  }, [cryptos]);

  const getCryptosPrice = () => {
    var count = 0;
    var tempQuery = '';

    cryptos.map((crypto) => {
      if (crypto.asset_name !== 'Cash') {
        tempQuery = tempQuery + 'X:' + crypto.ticker + crypto.currency;
        if (count < cryptos.length - 2) {
          tempQuery = tempQuery + ',';
        }
        count = count + 1;
      }
    });

    setQuery(tempQuery);

    const jsonify = (res) => res.json();
    const dataFetch = fetch(
      `https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/tickers?tickers=${query}&` +
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
    let processData = [];
    curr_DataSet.map((currData) => {
      processData.push({
        o: currData.day.o,
        p: currData.lastTrade.p,
        ticker: currData.ticker,
        t: currData.updated,
      });
    });

    setLatestData(processData);
  };

  const getCryptoOpeningPrice = (ticker, currency) => {
    if (latestData) {
      var completeCryptoName = `X:${ticker}${currency}`;
      var curCrypto = latestData.filter(
        (data) => data.ticker === completeCryptoName
      );

      if (curCrypto[0]) {
        var openPrice = {
          o: Number(curCrypto[0].o),
          p: Number(curCrypto[0].p),
        };
      }
      return openPrice;
    }
  };

  return (
    <div className="stats">
      <div className="stats__container">
        <div className="stats__header">
          <p> Current Profolio</p>
        </div>

        <div className="stats__content">
          <div className="stats__rows">
            {cryptos.map(
              (crypto) =>
                crypto.asset_name !== 'Cash' && (
                  <ProfolioTableRow
                    key={crypto.id}
                    name={crypto.asset_name}
                    openPrice={
                      getCryptoOpeningPrice(crypto.ticker, crypto.currency) &&
                      getCryptoOpeningPrice(crypto.ticker, crypto.currency).o
                    }
                    volume={crypto.quantity}
                    ticker={crypto.ticker}
                    currency={crypto.currency}
                    price={
                      getCryptoOpeningPrice(crypto.ticker, crypto.currency) &&
                      getCryptoOpeningPrice(crypto.ticker, crypto.currency).p
                    }
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfolioTable;
