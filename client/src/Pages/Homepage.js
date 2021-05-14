import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { USER_LOGIN_ERRORS_RESET } from '../constants/userConstants';

const Homepage = ({ location, history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

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

  return <div>This is Homepage</div>;
};

export default Homepage;
