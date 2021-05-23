import React, { useState, useEffect } from 'react';

import RealtimeCandleChart from './RealtimeCandleChart';
import RealtimePriceTable from '../DynamicTables/RealtimePriceTable';
import { useDispatch, useSelector } from 'react-redux';

const RealtimeChart = ({ cryptoPrice, openPrice, cryptoTickers }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, crypto } = cryptoListDetails;

  let [initData, setInitData] = useState([]);

  return (
    <div>
      <br />
      <h2>{cryptoTickers.base_currency_name}</h2>

      <RealtimePriceTable
        cryptoPrice={cryptoPrice}
        openPrice={openPrice}
        loading={loading}
      />

      <br />

      <RealtimeCandleChart cryptoTickers={cryptoTickers} />
    </div>
  );
};

export default RealtimeChart;
