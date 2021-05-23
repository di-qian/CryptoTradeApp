import React from 'react';
import { Spinner } from 'react-bootstrap';
import './RealtimePriceTable.css';

const RealtimePriceTable = ({ cryptoPrice, openPrice, loading }) => {
  const getPriceDiff = () => {
    let priceDiff;
    let priceDiffr;

    if (openPrice && cryptoPrice) {
      priceDiff = cryptoPrice - openPrice;
      priceDiffr = priceDiff.toPrecision(8);
    }

    return priceDiffr;
  };

  const getPercentDiff = () => {
    let percentDiff;
    let percentDiffr;

    if (openPrice && cryptoPrice) {
      percentDiff = ((cryptoPrice - openPrice) / openPrice) * 100;
      percentDiffr = percentDiff.toFixed(2);
    }

    return percentDiffr;
  };

  return (
    <div>
      {cryptoPrice && !loading ? (
        <h2>${cryptoPrice}</h2>
      ) : (
        <h2>
          <Spinner animation="grow" />
        </h2>
      )}
      {!getPriceDiff() || !getPercentDiff() || loading ? (
        <Spinner animation="grow" size="sm" />
      ) : (
        <h6 className={getPriceDiff() > 0 ? 'positivecolor' : 'negativecolor'}>
          ${getPriceDiff()} {getPercentDiff()}% Today
        </h6>
      )}
    </div>
  );
};

export default RealtimePriceTable;
