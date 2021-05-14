import React, { useState, useEffect } from 'react';
import './ProfolioTable.css';

import ProfolioTableRow from './ProfolioTableRow';
import { useDispatch, useSelector } from 'react-redux';

const ProfolioTable = (inLatestData) => {
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;

  const [curData, setCurData] = useState([]);

  useEffect(() => {
    setCurData(inLatestData.latestData);
  }, [inLatestData]);

  const getCryptoOpeningPrice = (ticker) => {
    if (curData.length > 0) {
      var completeCryptoName = `X:${ticker}USD`;
      var curCrypto = curData.filter(
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

  function formatted_datetime() {
    var result = '';
    var d = new Date();
    result +=
      d.getFullYear() +
      '/' +
      (d.getMonth() + 1) +
      '/' +
      d.getDate() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes() +
      ':' +
      d.getSeconds();
    return result;
  }

  return (
    <div className="stats">
      <div className="stats__container">
        <div className="stats__header">
          <div>
            <p> Current Profolio</p>
          </div>
          <div className="row__numbers">
            <p> {formatted_datetime()}</p>
            <p> Price/Coin</p>
          </div>
        </div>

        <div className="stats__content">
          <div className="stats__rows">
            {cryptos &&
              cryptos.map(
                (crypto) =>
                  crypto.asset_name !== 'Cash' && (
                    <ProfolioTableRow
                      key={crypto.id}
                      name={crypto.asset_name}
                      openPrice={
                        getCryptoOpeningPrice(crypto.asset_ticker) &&
                        getCryptoOpeningPrice(crypto.asset_ticker).o
                      }
                      volume={crypto.quantity}
                      ticker={crypto.asset_ticker}
                      price={
                        getCryptoOpeningPrice(crypto.asset_ticker) &&
                        getCryptoOpeningPrice(crypto.asset_ticker).p
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
