import React from 'react';

import RealtimeCandleChart from './RealtimeCandleChart';
import RealtimePriceTable from '../DynamicTables/RealtimePriceTable';
import { useSelector } from 'react-redux';

const RealtimeChart = ({ cryptoPrice, openPrice, cryptoTickers }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading } = cryptoListDetails;

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
