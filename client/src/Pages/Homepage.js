import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { USER_LOGIN_ERRORS_RESET } from '../constants/userConstants';

const Homepage = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [latestData, setLatestData] = useState([]);

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/auth/dashboard';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    } else {
      dispatch({ type: USER_LOGIN_ERRORS_RESET });
    }
  }, [history, userInfo, redirect, dispatch]);

  useEffect(() => {
    const jsonify = (res) => res.json();
    try {
      const results = fetch(
        'https://api.polygon.io/v2/snapshot/locale/global/markets/crypto/gainers?' +
          new URLSearchParams({
            apiKey: process.env.REACT_APP_APIKEY,
          })
      )
        .then(jsonify)
        .then((data) => {
          processCurrData(data.tickers);
        });
    } catch (err) {
      console.log(err);
    }
  }, [dispatch]);

  const processCurrData = (curr_DataSet) => {
    let processData = [];
    curr_DataSet.map((currData) => {
      processData.push({
        o: currData.todaysChange,
        p: currData.todaysChangePerc,
        ticker: currData.ticker,
        t: currData.updated,
      });
    });

    setLatestData(processData);
  };

  return <div>This is Homepage</div>;
};

export default Homepage;
