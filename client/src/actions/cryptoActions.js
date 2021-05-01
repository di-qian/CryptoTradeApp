import axios from 'axios';
const {
  CRYPTO_LIST_REQUEST,
  CRYPTO_LIST_SUCCESS,
  CRYPTO_LIST_FAIL,
  CRYPTO_LIST_DETAILS_REQUEST,
  CRYPTO_LIST_DETAILS_SUCCESS,
  CRYPTO_LIST_DETAILS_FAIL,
} = require('../constants/cryptoConstants');

export const listCryptos = () => async (dispatch) => {
  try {
    dispatch({ type: CRYPTO_LIST_REQUEST });

    const { data } = await axios.get('/api/v1/cryptos');

    dispatch({ type: CRYPTO_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: CRYPTO_LIST_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const listCryptosDetails = (cryptoTicker, userEmail) => async (
  dispatch
) => {
  try {
    dispatch({ type: CRYPTO_LIST_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/cryptos/${cryptoTicker}`);

    dispatch({ type: CRYPTO_LIST_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: CRYPTO_LIST_DETAILS_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
