import React, { useState, useEffect } from 'react';
import './ProfolioTable.css';
import { Spinner, Row, Col } from 'react-bootstrap';
import ProfolioTableRow from './ProfolioTableRow';
import { useDispatch, useSelector } from 'react-redux';
import { USER_LOGIN_ERRORS_RESET } from '../../constants/userConstants';

const AssetBalanceTable = ({ total_worth_v, latestData }) => {
  const cryptoList = useSelector((state) => state.cryptoList);
  const { loading, error, cryptos } = cryptoList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [curData, setCurData] = useState([]);
  const [today_difference_v, setToday_difference_v] = useState(0);
  const [total_difference_v, setTotal_difference_v] = useState(0);

  const regp = /[^0-9.-]+/g;

  useEffect(() => {
    var quantity = 0;
    var curPrice = 0;
    var openPrice = 0;
    var purchase_price = 0;

    var today_difference = 0;
    var total_difference = 0;

    setCurData(latestData);

    cryptos &&
      cryptos.map((crypto) => {
        quantity = Number(crypto.quantity);
        purchase_price = parseFloat(crypto.purchase_price.replace(regp, ''));

        curPrice =
          crypto.asset_ticker === 'Cash'
            ? 1.0
            : getCryptoCurPrice(crypto.asset_ticker) &&
              getCryptoCurPrice(crypto.asset_ticker).p;

        openPrice =
          crypto.asset_ticker === 'Cash'
            ? 1.0
            : getCryptoCurPrice(crypto.asset_ticker) &&
              getCryptoCurPrice(crypto.asset_ticker).o;

        today_difference += quantity * (curPrice - openPrice);
        setToday_difference_v(today_difference);
        total_difference += quantity * (curPrice - purchase_price);
        setTotal_difference_v(total_difference);
      });
  }, [latestData]);

  useEffect(() => {
    var quantity = 0;
    var curPrice = 0;
    var openPrice = 0;
    var purchase_price = 0;

    var today_difference = 0;
    var total_difference = 0;

    cryptos &&
      cryptos.map((crypto) => {
        quantity = Number(crypto.quantity);
        purchase_price = parseFloat(crypto.purchase_price.replace(regp, ''));

        curPrice =
          crypto.asset_ticker === 'Cash'
            ? 1.0
            : getCryptoCurPrice(crypto.asset_ticker) &&
              getCryptoCurPrice(crypto.asset_ticker).p;

        openPrice =
          crypto.asset_ticker === 'Cash'
            ? 1.0
            : getCryptoCurPrice(crypto.asset_ticker) &&
              getCryptoCurPrice(crypto.asset_ticker).o;

        today_difference += quantity * (curPrice - openPrice);
        setToday_difference_v(today_difference);
        total_difference += quantity * (curPrice - purchase_price);
        setTotal_difference_v(total_difference);
      });
  }, []);

  const retrieveCashInfo = () => {
    const cashinfo = cryptos.filter((crypto) => crypto.asset_name === 'Cash');

    return cashinfo[0] && cashinfo[0].quantity.toFixed(2);
  };

  const getCryptoCurPrice = (ticker) => {
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

  function formatted_datetime(e) {
    var result = '';
    var d = new Date(e);
    result = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    return result;
  }

  function today_date() {
    var result = '';
    var d = new Date();
    result = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    return result;
  }

  const printName = () => {
    //console.log(inLatestData);
  };
  return (
    <div className="mb-3 stats">
      {printName()}
      <div className="stats__container">
        <div className="stats__header">
          <div>
            <p>Account Overview</p>
          </div>
        </div>

        <div className="stats__content">
          <div className="namerow">
            <div>
              <p>Name: {userInfo.name}</p>
            </div>
            <div className="row__numbers">
              <p>Since: {formatted_datetime(userInfo.created_at)}</p>
              <p>Today: {today_date()}</p>
            </div>
          </div>

          <div className="accountrow">
            <div className="row__title">
              <p>Total Account Value: </p>
              <p>Today's Return: </p>
              <p>Total Return: </p>
            </div>
            <div className="row__numbers">
              <p>
                {total_worth_v
                  ? '$' + total_worth_v.toFixed(2)
                  : total_worth_v === 0 && '$0.00'}
              </p>
              <p
                className={
                  today_difference_v > 0
                    ? 'row__percentage_pos'
                    : today_difference_v < 0 && 'row__percentage_neg'
                }
              >
                {today_difference_v ? (
                  '$' + today_difference_v.toFixed(2)
                ) : today_difference_v === 0 ? (
                  '$0.00'
                ) : (
                  <Spinner animation="border" size="sm" variant="dark" />
                )}
              </p>
              <p
                className={
                  total_difference_v > 0
                    ? 'row__percentage_pos'
                    : total_difference_v < 0 && 'row__percentage_neg'
                }
              >
                {total_difference_v
                  ? '$' + total_difference_v.toFixed(2)
                  : total_difference_v
                  ? '$' + total_difference_v.toFixed(2)
                  : total_difference_v === 0 && '$0.00'}
              </p>
            </div>
          </div>

          <div className="cashrow">
            <div>
              <p>Total Cash Available: </p>
            </div>
            <div className="row__numbers">
              <p>
                {retrieveCashInfo() ? (
                  '$' + retrieveCashInfo()
                ) : (
                  <Spinner animation="border" size="sm" variant="dark" />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetBalanceTable;
