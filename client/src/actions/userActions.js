import axios from 'axios';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from '../constants/userConstants';
import { addCrypto } from './cryptoActions';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/users/login',
      { email, password },
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    sessionStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    // dispatch({
    //   type: USER_LOGIN_FAIL,
    //   payload: error.response.data,
    // });
  }
};

export const logout = () => (dispatch) => {
  sessionStorage.removeItem('userInfo');

  dispatch({ type: USER_LOGOUT });

  // document.location.href = '/login';
  document.location.href = '/';
};

export const register =
  (name, email, password, confirmPassword) => async (dispatch) => {
    try {
      dispatch({
        type: USER_REGISTER_REQUEST,
      });

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/v1/users',
        { name, email, password, confirmPassword },
        config
      );

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: data,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });

      sessionStorage.setItem('userInfo', JSON.stringify(data));

      let newCrypto = {
        user_id: data._id,
        owner_email: data.email,
        asset_name: 'Cash',
        asset_ticker: 'Cash',
        quantity: 0,
        purchase_price: 1,
      };

      await dispatch(addCrypto(newCrypto));
    } catch (error) {
      // dispatch({
      //   type: USER_REGISTER_FAIL,
      //   payload:
      //     error.response && error.response.data.message
      //       ? error.response.data.message
      //       : error.message,
      // });
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.response.data,
      });
    }
  };
