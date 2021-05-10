import React, { useState, useEffect } from 'react';

import RealtimeCandleChart from './RealtimeCandleChart';
import RealtimePriceTable from '../DynamicTables/RealtimePriceTable';
import { useDispatch, useSelector } from 'react-redux';

const RealtimeChart = ({ cryptoPrice, openPrice, cryptoTickers }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;

  //let [initPrice, setInitPrice] = useState(0);
  let [initData, setInitData] = useState([]);

  useEffect(() => {
    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // take next day date and reduce for one millisecond
    var endOfDay = new Date(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - 1
    );

    var startOfDayTimestamp = startOfDay.valueOf();
    var endOfDayTimestamp = endOfDay.valueOf();

    const ticker_currency = cryptoTickers.base_currency_symbol + 'USD';

    const jsonify = (res) => res.json();
    const dataFetch = fetch(
      `https://api.polygon.io/v2/aggs/ticker/X:${ticker_currency}/range/1/minute/${startOfDayTimestamp}/${endOfDayTimestamp}?unadjusted=true&sort=asc&limit=1440&` +
        new URLSearchParams({
          apiKey: process.env.REACT_APP_APIKEY,
        })
    )
      .then(jsonify)
      .then((data) => {
        let CurrData = [];

        //setInitPrice(Number(data.results[0].l));

        data.results &&
          data.results.forEach((i) => {
            var dt = new Date(i.t);
            dt.setMinutes(dt.getMinutes() + 1);

            CurrData.push({
              x: dt,
              y: [Number(i.o), Number(i.h), Number(i.l), Number(i.c)],
              v: Number(i.v),
            });
          });

        setInitData(CurrData);
      });
  }, [cryptoTickers]);

  const printName = () => {
    // console.log('initData: ' + initData);
    // console.log('crypto: ' + crypto);
  };

  return (
    <div>
      {printName()}
      <br />
      <h2>{cryptoTickers.base_currency_name}</h2>

      <RealtimePriceTable cryptoPrice={cryptoPrice} openPrice={openPrice} />

      <br />

      <RealtimeCandleChart crypto={crypto} baseData={initData} />
    </div>
  );
};

export default RealtimeChart;
