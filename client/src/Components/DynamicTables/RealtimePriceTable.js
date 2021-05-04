import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import './RealtimePriceTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { listCryptosDetails } from '../../actions/cryptoActions';

const RealtimePriceTable = ({ cryptoPrice, openPrice }) => {
  // const cryptoListDetails = useSelector((state) => state.cryptoListDetails);
  // const { loading, error, cryptos } = cryptoListDetails;

  // const [btcPrice, setBtcPrice] = useState({});
  const [priceDiff, setPriceDiff] = useState({});
  const [percentDiff, setPercentDiff] = useState({});

  // useEffect(() => {
  //   console.log(ticker);
  //   setInterval(function () {
  //     getBtcPrice();
  //   }, 1000);
  // }, []);

  // const getBtcPrice = () => {
  //   const jsonify = (res) => res.json();
  //   const dataFetch = fetch(
  //     `https://api.polygon.io/v1/last/crypto/${ticker}/USD?&` +
  //       new URLSearchParams({
  //         apiKey: process.env.REACT_APP_APIKEY,
  //       })
  //   )
  //     .then(jsonify)
  //     .then((data) => {
  //       var temp_btcprice = Number(data.last.price);
  //       var temp_btcprice_rounded = temp_btcprice.toFixed(2);

  //       setBtcPrice({ p: temp_btcprice_rounded });
  //       getPriceDiff();
  //       getPercentDiff();
  //     });
  // };

  const getPriceDiff = () => {
    let priceDiff;
    let priceDiffr;

    if (openPrice && cryptoPrice) {
      priceDiff = cryptoPrice - openPrice;
      priceDiffr = priceDiff.toFixed(2);
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
      {cryptoPrice ? (
        <h2>${cryptoPrice}</h2>
      ) : (
        <h2>
          <Spinner animation="grow" />
        </h2>
      )}
      {!getPriceDiff() || !getPercentDiff() ? (
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
