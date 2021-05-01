import React, { useState, useEffect } from 'react';
import './RealtimePriceTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptosDetails } from '../../actions/cryptoActions';

const RealtimePriceTable = ({ ticker, openPrice }) => {
  const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  const { loading, error, cryptos } = cryptoListDetails;

  const [btcPrice, setBtcPrice] = useState(0);
  const [priceDiff, setPriceDiff] = useState(0);
  const [percentDiff, setPercentDiff] = useState(0);

  useEffect(() => {
    console.log(ticker);
    setInterval(function () {
      getBtcPrice();
    }, 1000);
  }, []);

  const getBtcPrice = () => {
    const jsonify = (res) => res.json();
    const dataFetch = fetch(
      `https://api.polygon.io/v1/last/crypto/${ticker}/USD?&` +
        new URLSearchParams({
          apiKey: process.env.REACT_APP_APIKEY,
        })
    )
      .then(jsonify)
      .then((data) => {
        console.log(data);
        var temp_btcprice = Number(data.last.price);
        var temp_btcprice_rounded = temp_btcprice.toFixed(2);

        setBtcPrice(temp_btcprice_rounded);
      });
  };

  const getPriceDiff = () => {
    let priceDiff = btcPrice - openPrice;
    let priceDiffr = priceDiff.toFixed(2);

    return priceDiffr;
  };

  const getPercentDiff = () => {
    let percentDiff = ((btcPrice - openPrice) / openPrice) * 100;
    let percentDiffr = percentDiff.toFixed(2);

    return percentDiffr;
  };

  return (
    <div>
      <h2>${btcPrice}</h2>
      <h6 className={getPriceDiff() > 0 ? 'positivecolor' : 'negativecolor'}>
        ${getPriceDiff()} ({getPercentDiff()}%) Today
      </h6>
    </div>
  );
};

export default RealtimePriceTable;
